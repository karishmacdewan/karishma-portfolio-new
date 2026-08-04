'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Rellax from 'rellax';

import { useSettledViewportEffect } from '@/hooks/use-settled-viewport-effect';
import { instrumentSerifRegular } from '@/lib/fonts';

import { DO_THUNDERBOLT_ANIM } from './config';
import { HERO_TAGLINE } from './copy';
import { CurtainLightning } from './CurtainLightning';
import styles from './hero.module.scss';
import { HeroMessage } from './HeroMessage';
import { Hold } from './Hold';
import { useCurtainGestureGate } from './use-curtain-gesture-gate';
import { useHeroThemeScrollState } from './use-hero-theme-scroll-state';

const BAR_COUNT = 48;
const CURTAIN_HOLD_START = 0.81;

const layers = [
    {
        minSpeed: 2,
        maxSpeed: 3,
        zIndex: 0,
        extraHeight: 0
    },
    {
        minSpeed: 4,
        maxSpeed: 6,
        zIndex: 20,
        extraHeight: 0
    },
    {
        minSpeed: 7,
        maxSpeed: 9,
        zIndex: 20,
        extraHeight: 0
    },
    {
        minSpeed: 10,
        maxSpeed: 12,
        zIndex: 20,
        extraHeight: 2
    }
] as const;

function seededFraction(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

function BarsLayer({
    layerIndex,
    minSpeed,
    maxSpeed,
    zIndex,
    extraHeight
}: {
    layerIndex: number;
    minSpeed: number;
    maxSpeed: number;
    zIndex: number;
    extraHeight: number;
}) {
    const bars = useMemo(
        () =>
            Array.from({ length: BAR_COUNT }, (_, index) => ({
                height: (index / (BAR_COUNT - 1)) * 100 + extraHeight,
                speed: minSpeed + seededFraction(layerIndex * 1000 + index + 1) * (maxSpeed - minSpeed)
            })),
        [extraHeight, layerIndex, maxSpeed, minSpeed]
    );

    return (
        <div className={styles.layer} data-layer={layerIndex + 1} style={{ zIndex }} aria-hidden="true">
            <div className={`${styles.barTrack} ${styles.topTrack}`}>
                {bars.map((bar, index) => (
                    <span
                        key={index}
                        className={`${styles.bar} mobile-curtain-rellax`}
                        style={{ height: `calc(${bar.height}% + 2px)` }}
                        data-rellax-speed={bar.speed}
                    />
                ))}
            </div>
            <div className={`${styles.barTrack} ${styles.bottomTrack}`}>
                {[...bars].reverse().map((bar, index) => (
                    <span
                        key={index}
                        className={`${styles.bar} mobile-curtain-rellax`}
                        style={{ height: `calc(${bar.height}% + 2px)` }}
                        data-rellax-speed={-bar.speed}
                    />
                ))}
            </div>
        </div>
    );
}

export function MobileCurtainHero({
    onReady,
    onCurtainStop,
    onCurtainAdvance
}: {
    onReady?: () => void;
    onCurtainStop?: (top: number) => void;
    onCurtainAdvance?: (top: number) => void;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const barsChapterRef = useRef<HTMLDivElement>(null);
    const rellaxRef = useRef<Rellax | null>(null);
    const curtainHeldRef = useRef(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isCurtainHeld, setIsCurtainHeld] = useState(false);
    const isThemeScrolling = useHeroThemeScrollState();
    const { scrollYProgress } = useScroll({
        target: barsChapterRef,
        offset: ['start start', 'end end']
    });

    useCurtainGestureGate({
        chapterRef: barsChapterRef,
        curtainProgress: scrollYProgress,
        holdStart: CURTAIN_HOLD_START,
        onCurtainStop,
        onCurtainAdvance
    });

    const updateCurtainHold = useCallback((shouldHold: boolean) => {
        if (shouldHold === curtainHeldRef.current || (shouldHold && !rellaxRef.current)) return;

        if (shouldHold) {
            barsChapterRef.current?.querySelectorAll<HTMLElement>(`.${styles.bar}`).forEach((bar) => {
                bar.style.setProperty('--curtain-held-transform', window.getComputedStyle(bar).transform);
            });
        }

        curtainHeldRef.current = shouldHold;
        setIsCurtainHeld(shouldHold);
    }, []);

    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        updateCurtainHold(progress >= CURTAIN_HOLD_START);
    });
    useSettledViewportEffect(() => rellaxRef.current?.refresh());

    useEffect(() => onReady?.(), [onReady]);

    useEffect(() => {
        const rellax = new Rellax('[data-mobile-curtain-hero] .mobile-curtain-rellax', {
            breakpoints: [640, 768, 1024]
        });
        rellaxRef.current = rellax;
        const frame = window.requestAnimationFrame(() => {
            rellax.refresh();
            updateCurtainHold(scrollYProgress.get() >= CURTAIN_HOLD_START);
        });

        return () => {
            window.cancelAnimationFrame(frame);
            rellax.destroy();
            if (rellaxRef.current === rellax) rellaxRef.current = null;
        };
    }, [scrollYProgress, updateCurtainHold]);

    useEffect(() => {
        const updateStartedState = () => {
            const sectionTop = sectionRef.current?.offsetTop ?? 0;
            setHasStarted(window.scrollY > sectionTop + 16);
        };

        updateStartedState();
        window.addEventListener('scroll', updateStartedState, {
            passive: true
        });
        return () => window.removeEventListener('scroll', updateStartedState);
    }, []);

    return (
        <section
            id="home"
            ref={sectionRef}
            className={`${styles.desktopHero} ${styles.mobileCurtainHero}`}
            data-mobile-curtain-hero
            data-started={hasStarted}
            data-curtain-held={isCurtainHeld}
            data-thunderbolt-anim={DO_THUNDERBOLT_ANIM}
            data-theme-scrolling={isThemeScrolling}
        >
            <div ref={barsChapterRef} className={styles.desktopBarsChapter}>
                <div className={styles.desktopScene}>
                    <div className={styles.desktopCopy}>
                        <h1
                            className={`${instrumentSerifRegular.className} ${styles.identitySubheading} ${styles.mobileIdentitySubheading}`}
                            aria-label={HERO_TAGLINE}
                        >
                            Strategy, <em>taste</em> &amp; code
                            <span className={styles.heroAccent}>.</span>
                        </h1>
                        <p className={styles.heroSupportLine}>
                            From enterprise strategy and operating models to architecture, production and commercial impact
                        </p>
                    </div>
                    <div className={styles.heroScreenDetails} aria-hidden="true">
                        <p className={styles.heroScreenLeft}>Senior AI Strategy &amp; Digital Transformation Lead · ex-Google</p>
                        <p className={styles.heroScreenRight}>Selected advisory, transformation and interim engagements</p>
                    </div>

                    <div className={styles.desktopStageCue}>
                        <div className={styles.desktopScroll}>
                            <span>keep scrolling</span>
                            <ArrowDown className={styles.scrollCueArrow} aria-hidden="true" />
                        </div>
                    </div>

                    {layers.map((layer, index) => (
                        <BarsLayer key={index} layerIndex={index} {...layer} />
                    ))}

                    {DO_THUNDERBOLT_ANIM && <CurtainLightning mobile />}
                </div>
                <Hold chapter="curtain" />
            </div>
            <HeroMessage variant="touch" />
        </section>
    );
}
