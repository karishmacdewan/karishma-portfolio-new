'use client';

import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Reveal } from '@/components/ui/Reveal';

import styles from './gallery.module.scss';
import { ProjectArtwork } from './ProjectArtwork';
import { ProjectDialog } from './ProjectDialog';
import type { Project } from './types';

const CARD_HOLD_MIN_MS = 4500;
const CARD_HOLD_MAX_MS = 10500;
const DO_AUTO_TILE_FLIP = false;
const DO_ENLARGE_ON_HOVER = true;
const CAN_EXPAND_PROJECTS = process.env.CAN_EXPAND_PROJECTS === 'true';
const HOVERED_TILE_SCALE = 1.04;
const GALLERY_FLAT_START = 0.14;
const GALLERY_FLAT_END = 0.7;
const GALLERY_SCROLL_STOPS = [0, GALLERY_FLAT_START, GALLERY_FLAT_END, 1];

function ProjectCardFace({ project, source, back = false }: { project: Project; source: string; back?: boolean }) {
    return (
        <span
            className={`${styles.desktopCardFace} ${back ? styles.desktopCardFaceBack : styles.desktopCardFaceFront}`}
            aria-hidden={back ? 'true' : undefined}
        >
            <span className={styles.desktopCardSurface} aria-hidden="true" />
            <span className={styles.desktopCardArtworkLayer}>
                <ProjectArtwork project={project} source={source} className={styles.cardMedia} />
            </span>
            <span className={styles.desktopCardSheen} aria-hidden="true" />
        </span>
    );
}

function DesktopProjectCard({ project }: { project: Project }) {
    const sources = project.thumbnail.filter(Boolean);
    const cardRef = useRef<HTMLButtonElement>(null);
    const isInView = useInView(cardRef, { amount: 0.25 });
    const reducedMotion = Boolean(useReducedMotion());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [flipping, setFlipping] = useState(false);
    const canAutoFlip = DO_AUTO_TILE_FLIP && project.cardArtwork !== 'client-logo' && sources.length > 1;
    const shouldEnlarge = DO_ENLARGE_ON_HOVER && !reducedMotion;

    useEffect(() => {
        if (!canAutoFlip || !isInView || flipping) return;

        const holdDuration = CARD_HOLD_MIN_MS + Math.random() * (CARD_HOLD_MAX_MS - CARD_HOLD_MIN_MS);
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
    }, [canAutoFlip, currentIndex, flipping, isInView, reducedMotion, sources.length]);

    const currentSource = sources[currentIndex];
    if (!currentSource) return null;

    const nextSource = sources[nextIndex] ?? currentSource;

    const card = (
        <motion.button
            ref={cardRef}
            type="button"
            className={`${styles.desktopCard} ${canAutoFlip ? '' : styles.desktopCardStatic}`}
            aria-label={CAN_EXPAND_PROJECTS ? `Open details for ${project.title}` : project.title}
            data-expandable={CAN_EXPAND_PROJECTS}
            disabled={!CAN_EXPAND_PROJECTS}
            whileHover={shouldEnlarge ? { scale: HOVERED_TILE_SCALE, zIndex: 2 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.65 }}
        >
            <span className={styles.desktopCardParallax} aria-hidden="true">
                <span
                    className={`${styles.desktopCardRotator} ${flipping ? styles.desktopCardRotatorFlipping : ''}`}
                    onAnimationEnd={(event) => {
                        if (event.currentTarget !== event.target || !flipping) return;

                        const completedIndex = nextIndex;
                        setCurrentIndex(completedIndex);

                        window.requestAnimationFrame(() => {
                            setFlipping(false);
                            setNextIndex((completedIndex + 1) % sources.length);
                        });
                    }}
                >
                    <span className={styles.desktopCardVisual}>
                        <ProjectCardFace project={project} source={currentSource} />
                        {canAutoFlip && <ProjectCardFace project={project} source={nextSource} back />}
                        {canAutoFlip && (
                            <>
                                <span className={`${styles.desktopCardEdge} ${styles.desktopCardEdgeTop}`} aria-hidden="true" />
                                <span className={`${styles.desktopCardEdge} ${styles.desktopCardEdgeBottom}`} aria-hidden="true" />
                            </>
                        )}
                    </span>
                </span>
            </span>
        </motion.button>
    );

    if (!CAN_EXPAND_PROJECTS) return card;

    return <ProjectDialog project={project}>{card}</ProjectDialog>;
}

export function DesktopProjectGallery({ products, onReady }: { products: Project[]; onReady?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 30%', 'end start']
    });

    const springConfig = { stiffness: 220, damping: 34, bounce: 0 };
    const rotateX = useSpring(useTransform(scrollYProgress, GALLERY_SCROLL_STOPS, [4, 0, 0, -1.2]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, GALLERY_SCROLL_STOPS, [0.24, 1, 1, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, GALLERY_SCROLL_STOPS, [5, 0, 0, -1.4]), springConfig);
    const galleryMotion = { opacity, rotateX, rotateZ };

    useEffect(() => {
        onReady?.();
    }, [onReady]);

    return (
        <div ref={ref} className={styles.desktopGallery}>
            <motion.div className={styles.desktopGrid} style={galleryMotion}>
                {products.map((project, index) => (
                    <div key={project.title} className={styles.desktopGridItem}>
                        <Reveal width="100%" delay={(index % 4) * 0.06} overflow="visible">
                            <DesktopProjectCard project={project} />
                        </Reveal>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
