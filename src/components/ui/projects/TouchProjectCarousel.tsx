'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import { Reveal } from '@/components/ui/Reveal';

import styles from './gallery.module.scss';
import { ProjectArtwork } from './ProjectArtwork';
// import { ProjectDialog } from './ProjectDialog';
import type { Project } from './types';

function circularDistance(index: number, selectedIndex: number, total: number) {
    let distance = index - selectedIndex;

    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;

    return distance;
}

function getCardAnimation(distance: number, reducedMotion: boolean) {
    if (reducedMotion) {
        return {
            opacity: distance === 0 ? 1 : 0.55,
            rotateY: 0,
            scale: distance === 0 ? 1 : 0.94,
            z: 0
        };
    }

    const absoluteDistance = Math.abs(distance);

    return {
        opacity: absoluteDistance === 0 ? 1 : absoluteDistance === 1 ? 0.68 : 0.3,
        rotateY: absoluteDistance === 0 ? 0 : distance < 0 ? 34 : -34,
        scale: absoluteDistance === 0 ? 1 : absoluteDistance === 1 ? 0.88 : 0.78,
        z: absoluteDistance === 0 ? 0 : absoluteDistance === 1 ? -90 : -160
    };
}

const MOBILE_CARD_HOLD_MIN_MS = 5200;
const MOBILE_CARD_HOLD_MAX_MS = 9000;

function TouchProjectCard({
    project,
    selected,
    dragging,
    reducedMotion
}: {
    project: Project;
    selected: boolean;
    dragging: boolean;
    reducedMotion: boolean;
}) {
    const sources = project.thumbnail.filter(Boolean);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [flipping, setFlipping] = useState(false);
    const canFlip = project.cardArtwork !== 'client-logo' && sources.length > 1;

    useEffect(() => {
        if (!canFlip || !selected || dragging || flipping) return;

        const holdDuration = MOBILE_CARD_HOLD_MIN_MS + Math.random() * (MOBILE_CARD_HOLD_MAX_MS - MOBILE_CARD_HOLD_MIN_MS);
        const timer = window.setTimeout(() => {
            const followingIndex = (currentIndex + 1) % sources.length;

            if (reducedMotion) {
                setCurrentIndex(followingIndex);
                setNextIndex((followingIndex + 1) % sources.length);
                return;
            }

            setNextIndex(followingIndex);
            setFlipping(true);
        }, holdDuration);

        return () => window.clearTimeout(timer);
    }, [canFlip, currentIndex, dragging, flipping, reducedMotion, selected, sources.length]);

    const currentSource = sources[currentIndex];
    if (!currentSource) return null;

    const nextSource = sources[nextIndex] ?? currentSource;

    return (
        <div className={styles.touchCard} role="img" aria-label={project.title}>
            <span
                className={`${styles.touchCardRotator} ${flipping ? styles.touchCardRotatorFlipping : ''}`}
                onAnimationEnd={(event) => {
                    if (event.currentTarget !== event.target || !flipping) return;
                    setCurrentIndex(nextIndex);
                    setNextIndex((nextIndex + 1) % sources.length);
                    setFlipping(false);
                }}
            >
                <span className={`${styles.touchCardFace} ${styles.touchCardFaceFront}`}>
                    <ProjectArtwork project={project} source={currentSource} className={styles.cardMedia} />
                    <span className={styles.touchCardSheen} aria-hidden="true" />
                </span>
                {canFlip && (
                    <span className={`${styles.touchCardFace} ${styles.touchCardFaceBack}`} aria-hidden="true">
                        <ProjectArtwork project={project} source={nextSource} className={styles.cardMedia} />
                        <span className={styles.touchCardSheen} aria-hidden="true" />
                    </span>
                )}
            </span>
        </div>
    );
}

export function TouchProjectCarousel({
    products,
    reducedMotion = false,
    onReady
}: {
    products: Project[];
    reducedMotion?: boolean;
    onReady?: () => void;
}) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const cardStageRefs = useRef<Array<HTMLDivElement | null>>([]);
    const draggingRef = useRef(false);
    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const systemPrefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = reducedMotion || Boolean(systemPrefersReducedMotion);
    const { scrollYProgress } = useScroll({
        target: galleryRef,
        offset: ['start end', 'end start']
    });
    const stageSpring = { stiffness: 180, damping: 30, bounce: 0 };
    const stageOpacity = useSpring(useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [0.66, 1, 1, 0.72]), stageSpring);
    const stageRotateX = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.68, 1], [10, 0, 0, -7]), stageSpring);
    const stageScale = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1, 1, 0.97]), stageSpring);
    const stageY = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [30, 0, 0, 18]), stageSpring);
    const stageZ = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-70, 0, 0, -45]), stageSpring);

    useEffect(() => {
        onReady?.();
    }, [onReady]);

    const updateSelection = useCallback((carouselApi: CarouselApi) => {
        if (carouselApi) {
            setSelectedIndex(carouselApi.selectedScrollSnap());
        }
    }, []);

    const updateCardTransforms = useCallback(
        (carouselApi: NonNullable<CarouselApi>) => {
            const scrollProgress = carouselApi.scrollProgress();
            const scrollSnaps = carouselApi.scrollSnapList();
            const engine = carouselApi.internalEngine();
            const snapStep = scrollSnaps.length > 1 ? Math.abs(scrollSnaps[1] - scrollSnaps[0]) : 1;

            scrollSnaps.forEach((scrollSnap, snapIndex) => {
                let distance = (scrollSnap - scrollProgress) / snapStep;
                const slideIndexes = engine.slideRegistry[snapIndex] ?? [];

                slideIndexes.forEach((slideIndex) => {
                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopPoint) => {
                            if (loopPoint.index !== slideIndex || loopPoint.target() === 0) return;
                            const loopedSnap = loopPoint.target() < 0 ? scrollSnap - 1 : scrollSnap + 1;
                            distance = (loopedSnap - scrollProgress) / snapStep;
                        });
                    }

                    const stage = cardStageRefs.current[slideIndex];
                    if (!stage) return;

                    const limitedDistance = Math.max(-2, Math.min(2, distance));
                    const absoluteDistance = Math.abs(limitedDistance);
                    const lift = draggingRef.current ? -18 * Math.max(0, 1 - absoluteDistance) : 0;
                    const opacity = 1 - Math.min(absoluteDistance, 2) * 0.32;
                    const rotateY = -34 * Math.max(-1, Math.min(1, limitedDistance));
                    const scale = 1 - Math.min(absoluteDistance, 1) * 0.12 - Math.max(0, absoluteDistance - 1) * 0.08;
                    const z = -90 * Math.min(absoluteDistance, 1) - Math.max(0, absoluteDistance - 1) * 70;

                    if (shouldReduceMotion) {
                        stage.style.opacity = String(absoluteDistance < 0.5 ? 1 : 0.55);
                        stage.style.transform = `scale(${absoluteDistance < 0.5 ? 1 : 0.94})`;
                        return;
                    }

                    stage.style.opacity = String(opacity);
                    stage.style.transform = `translate3d(0, ${lift}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
                });
            });
        },
        [shouldReduceMotion]
    );

    useEffect(() => {
        if (!api) return;

        updateSelection(api);
        updateCardTransforms(api);
        api.on('select', updateSelection);
        api.on('reInit', updateSelection);
        api.on('reInit', updateCardTransforms);
        api.on('scroll', updateCardTransforms);
        api.on('slideFocus', updateCardTransforms);

        const handlePointerDown = () => {
            draggingRef.current = true;
            setIsDragging(true);
            updateCardTransforms(api);
        };
        const handlePointerUp = () => {
            draggingRef.current = false;
            setIsDragging(false);
            updateCardTransforms(api);
        };

        api.on('pointerDown', handlePointerDown);
        api.on('pointerUp', handlePointerUp);

        return () => {
            api.off('select', updateSelection);
            api.off('reInit', updateSelection);
            api.off('reInit', updateCardTransforms);
            api.off('scroll', updateCardTransforms);
            api.off('slideFocus', updateCardTransforms);
            api.off('pointerDown', handlePointerDown);
            api.off('pointerUp', handlePointerUp);
        };
    }, [api, updateCardTransforms, updateSelection]);

    return (
        <div ref={galleryRef} className={styles.touchGallery}>
            <motion.div
                className={styles.touchGalleryStage}
                style={
                    shouldReduceMotion
                        ? undefined
                        : {
                              opacity: stageOpacity,
                              rotateX: stageRotateX,
                              scale: stageScale,
                              y: stageY,
                              z: stageZ
                          }
                }
            >
                <Carousel
                    setApi={setApi}
                    opts={{ align: 'center', loop: true, skipSnaps: false }}
                    className={`${styles.carousel} ${isDragging ? styles.carouselDragging : ''}`}
                    aria-label="Selected projects"
                >
                    <CarouselContent className={styles.carouselContent}>
                        {products.map((project, index) => {
                            const distance = circularDistance(index, selectedIndex, products.length);

                            return (
                                <CarouselItem key={project.title} className={styles.carouselItem} aria-label={`${index + 1} of ${products.length}`}>
                                    <Reveal width="100%" delay={(index % 3) * 0.06} overflow="visible" cover>
                                        <motion.div
                                            ref={(node) => {
                                                cardStageRefs.current[index] = node;
                                            }}
                                            className={styles.touchCardStage}
                                            initial={getCardAnimation(distance, shouldReduceMotion)}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 260,
                                                damping: 28,
                                                mass: 0.8
                                            }}
                                        >
                                            {/* ProjectDialog and the title/headline overlay are intentionally disabled for now. */}
                                            <TouchProjectCard
                                                project={project}
                                                selected={index === selectedIndex}
                                                dragging={isDragging}
                                                reducedMotion={shouldReduceMotion}
                                            />
                                        </motion.div>
                                    </Reveal>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>

                    <div className={styles.carouselControls}>
                        <button type="button" onClick={() => api?.scrollPrev()} aria-label="Previous project">
                            <ArrowLeft aria-hidden="true" />
                        </button>
                        <div className={styles.dots} aria-label="Choose a project">
                            {products.map((project, index) => (
                                <button
                                    key={project.title}
                                    type="button"
                                    className={index === selectedIndex ? styles.activeDot : ''}
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Go to project ${index + 1}: ${project.title}`}
                                    aria-current={index === selectedIndex ? 'true' : undefined}
                                />
                            ))}
                        </div>
                        <button type="button" onClick={() => api?.scrollNext()} aria-label="Next project">
                            <ArrowRight aria-hidden="true" />
                        </button>
                    </div>
                </Carousel>
            </motion.div>
        </div>
    );
}
