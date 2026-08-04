'use client';

import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useId, useRef, useState } from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { SpotlightText } from '@/components/ui/SpotlightText';

import { HERO_PATH, HERO_STATEMENT, HERO_STATEMENT_FINAL, HERO_STATEMENT_ROWS, HERO_STRATEGY } from './copy';
import { CLIENT_CAROUSEL_MODE_EVENT, type ClientCarouselMode } from './events';
import styles from './hero.module.scss';
import { Hold } from './Hold';
import { WordBankBg } from './WordBankBg';

interface HeroMessageProps {
    variant: 'desktop' | 'touch';
    reducedMotion?: boolean;
}

const STATEMENT_STAGE_RANGES: [number, number][] = [
    [0, 0.2],
    [0.2, 0.4],
    [0.4, 0.6],
    [0.6, 0.8]
];

const smoothStep = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    return clamped * clamped * (3 - 2 * clamped);
};

const getStageActivity = (progress: number, start: number, end: number) => {
    if (progress < start || progress > end) return 0;

    const local = (progress - start) / Math.max(0.001, end - start);
    return smoothStep(Math.min(1, local / 0.18));
};

const isStageActive = (progress: number, index: number, start: number, end: number) => {
    if (index === 3) return progress >= start && progress < 0.88;
    return progress >= start && progress < end;
};

const getStageOpacity = (progress: number, index: number, start: number, end: number) => {
    const finalFade = smoothStep((progress - 0.88) / 0.06);
    const base = isStageActive(progress, index, start, end) ? 1 : progress > end ? 0.3 : 0.13;

    return base * (1 - finalFade);
};

const getStageBlur = (progress: number, index: number, start: number, end: number) => {
    if (progress >= 0.88) return 'blur(0px)';
    if (isStageActive(progress, index, start, end)) {
        return `blur(${10 * (1 - getStageActivity(progress, start, end))}px)`;
    }

    return progress > end ? 'blur(0px)' : 'blur(2.5px)';
};

function StatementStage({
    keyword,
    descriptor,
    index,
    scrollProgress,
    reducedMotion
}: {
    keyword: string;
    descriptor: string;
    index: number;
    scrollProgress: MotionValue<number>;
    reducedMotion: boolean;
}) {
    const [start, end] = STATEMENT_STAGE_RANGES[index];
    const activity = useTransform(scrollProgress, (progress) => getStageActivity(progress, start, end));
    const rowOpacity = useTransform(scrollProgress, (progress) => getStageOpacity(progress, index, start, end));
    const rowBlur = useTransform(scrollProgress, (progress) => getStageBlur(progress, index, start, end));
    const labelX = useTransform(activity, (value) => -24 * (1 - value));
    const descriptorX = useTransform(activity, (value) => 24 * (1 - value));

    return (
        <div className={styles.statementStage}>
            <motion.span
                className={styles.statementKeyword}
                style={
                    reducedMotion
                        ? undefined
                        : {
                              opacity: rowOpacity,
                              x: labelX,
                              filter: rowBlur
                          }
                }
            >
                {keyword}
            </motion.span>
            <motion.span
                className={styles.statementDescriptor}
                style={
                    reducedMotion
                        ? undefined
                        : {
                              opacity: rowOpacity,
                              x: descriptorX,
                              filter: rowBlur
                          }
                }
            >
                {descriptor}
            </motion.span>
        </div>
    );
}

function StatementChapter({ variant, reducedMotion }: Required<HeroMessageProps>) {
    const chapterRef = useRef<HTMLDivElement>(null);
    const isFinalStateRef = useRef(reducedMotion);
    const [isFinalState, setIsFinalState] = useState(reducedMotion);
    const { scrollYProgress } = useScroll({
        target: chapterRef,
        offset: ['start start', 'end end']
    });
    const stagesY = useTransform(scrollYProgress, [0.88, 0.94], [0, -26], {
        clamp: true
    });
    const markerTop = useTransform(scrollYProgress, (progress) => {
        const stageProgress = Math.min(3, Math.max(0, Math.min(progress, 0.799) / 0.2));
        return `calc(${12.5 + stageProgress * 25}% - 3px)`;
    });
    const markerOpacity = useTransform(scrollYProgress, [0.86, 0.88], [1, 0], {
        clamp: true
    });
    const markerVisibility = useTransform(scrollYProgress, (progress) => (progress >= 0.88 ? 'hidden' : 'visible'));
    const bloomTop = useTransform(scrollYProgress, (progress) => {
        const stageProgress = Math.min(3, Math.max(0, Math.min(progress, 0.799) / 0.2));
        return `${22 + stageProgress * 14}%`;
    });

    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        const nextFinalState = progress >= 0.94;
        if (nextFinalState === isFinalStateRef.current) return;

        isFinalStateRef.current = nextFinalState;
        setIsFinalState(nextFinalState);
    });

    return (
        <div
            ref={chapterRef}
            className={styles.statementChapter}
            data-final-state={isFinalState}
            data-variant={variant}
            data-reduced-motion={reducedMotion}
        >
            <div className={styles.narrativeSticky}>
                <div className={styles.heroStatement} aria-label={HERO_STATEMENT}>
                    <motion.span className={styles.statementBloom} style={reducedMotion ? undefined : { top: bloomTop }} aria-hidden="true" />
                    <motion.span
                        className={styles.statementMarker}
                        style={
                            reducedMotion
                                ? undefined
                                : {
                                      top: markerTop,
                                      opacity: markerOpacity,
                                      visibility: markerVisibility
                                  }
                        }
                        aria-hidden="true"
                    />
                    <motion.div className={styles.statementRows} style={reducedMotion ? undefined : { y: stagesY }}>
                        {HERO_STATEMENT_ROWS.map((row, index) => (
                            <StatementStage key={row.keyword} index={index} scrollProgress={scrollYProgress} reducedMotion={reducedMotion} {...row} />
                        ))}
                    </motion.div>
                </div>
            </div>
            <Hold chapter="statement" />
            <div className={styles.transformationClosing}>
                <motion.p
                    className={styles.statementFinal}
                    initial={reducedMotion ? false : { opacity: 0, y: 15, filter: 'blur(5px)' }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.45, margin: '0px 0px -22% 0px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {HERO_STATEMENT_FINAL}
                    <span className={styles.statementAccent}>.</span>
                </motion.p>
            </div>
        </div>
    );
}

// Kept intact so the client chapter can be restored later.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ClientChapter({ variant, reducedMotion }: Required<HeroMessageProps>) {
    const chapterRef = useRef<HTMLDivElement>(null);
    const carouselModeRef = useRef<ClientCarouselMode>('hidden');
    const { scrollYProgress } = useScroll({
        target: chapterRef,
        offset: ['start start', 'end end']
    });

    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        const carouselMode: ClientCarouselMode = progress <= 0.002 ? 'hidden' : progress >= 0.92 ? 'footer' : 'showcase';
        if (carouselMode === carouselModeRef.current) return;

        carouselModeRef.current = carouselMode;
        window.dispatchEvent(
            new CustomEvent(CLIENT_CAROUSEL_MODE_EVENT, {
                detail: { mode: carouselMode }
            })
        );
    });

    return (
        <section
            ref={chapterRef}
            className={styles.clientChapter}
            data-client-chapter
            data-variant={variant}
            data-reduced-motion={reducedMotion}
            aria-labelledby="client-chapter-title"
        >
            <div className={styles.clientSticky}>
                <div id="client-chapter-title" className={styles.clientHeader}>
                    <SectionHeader title="for clients like" dir="l" />
                </div>
            </div>
            <Hold chapter="client" />
        </section>
    );
}

function PathSegment({
    item,
    index,
    variant,
    scrollProgress,
    chapterProgress,
    reducedMotion
}: {
    item: (typeof HERO_PATH)[number];
    index: number;
    variant: HeroMessageProps['variant'];
    scrollProgress: MotionValue<number>;
    chapterProgress: MotionValue<number>;
    reducedMotion: boolean;
}) {
    const start = 0.68 + index * 0.075;
    const end = start + 0.1;
    const horizontalOffset = variant === 'touch' ? (index === 0 ? 18 : index === 2 ? -18 : 0) : index === 0 ? -34 : index === 2 ? 34 : 0;
    const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
    const x = useTransform(scrollProgress, [start, end], [horizontalOffset, 0]);
    const y = useTransform(scrollProgress, [start, end], [30, 0]);
    const scale = useTransform(scrollProgress, [start, end], [0.94, 1]);
    const filter = useTransform(scrollProgress, [start, end], ['blur(0.9rem)', 'blur(0rem)']);
    const collapseStart = 0.79 + (2 - index) * 0.008;
    const collapseEnd = 0.855;
    const collapseTargets =
        variant === 'touch'
            ? [
                  [-36, -54],
                  [24, 58],
                  [42, -46]
              ]
            : [
                  [-92, -72],
                  [54, 78],
                  [104, -64]
              ];
    const [collapseXTarget, collapseYTarget] = collapseTargets[index];
    const collapseOpacity = useTransform(chapterProgress, [collapseStart, collapseEnd - 0.012, collapseEnd], [1, 0.32, 0]);
    const collapseX = useTransform(chapterProgress, [collapseStart, collapseEnd], [0, collapseXTarget]);
    const collapseY = useTransform(chapterProgress, [collapseStart, collapseEnd], [0, collapseYTarget]);
    const collapseScale = useTransform(chapterProgress, [collapseStart, collapseEnd], [1, 0.12]);
    const collapseFilter = useTransform(chapterProgress, [collapseStart, collapseEnd], ['blur(0rem)', 'blur(0.12rem)']);

    return (
        <motion.span className={styles.heroPathSegment} data-capability={item} style={reducedMotion ? undefined : { opacity, x, y, scale, filter }}>
            <motion.span
                className={styles.heroPathOutro}
                style={
                    reducedMotion
                        ? undefined
                        : {
                              opacity: collapseOpacity,
                              x: collapseX,
                              y: collapseY,
                              scale: collapseScale,
                              filter: collapseFilter
                          }
                }
            >
                <SpotlightText text={item} className={styles.heroPathWord} data-tone={item === 'intelligence' ? 'pink' : 'blue'}>
                    {item}
                </SpotlightText>
            </motion.span>
        </motion.span>
    );
}

function SymmetricArrowhead({
    x,
    tipY,
    shoulderY,
    shoulderWidth,
    className,
    stroke,
    pathLength,
    reducedMotion,
    animationDelay
}: {
    x: number;
    tipY: number;
    shoulderY: number;
    shoulderWidth: number;
    className: string;
    stroke: string;
    pathLength: MotionValue<number>;
    reducedMotion: boolean;
    animationDelay?: string;
}) {
    const style = reducedMotion ? { animationDelay } : { pathLength, animationDelay };

    return (
        <g>
            <motion.path className={className} d={`M${x} ${tipY} L${x - shoulderWidth} ${shoulderY}`} stroke={stroke} style={style} />
            <motion.path className={className} d={`M${x} ${tipY} L${x + shoulderWidth} ${shoulderY}`} stroke={stroke} style={style} />
        </g>
    );
}

function StrategyFlow({
    variant,
    scrollProgress,
    chapterProgress,
    reducedMotion
}: {
    variant: HeroMessageProps['variant'];
    scrollProgress: MotionValue<number>;
    chapterProgress: MotionValue<number>;
    reducedMotion: boolean;
}) {
    const gradientId = `strategy-flow-${useId().replaceAll(':', '')}`;
    const branchPoints = variant === 'touch' ? [150, 300, 450] : [100, 300, 500];
    const arrowShoulder = variant === 'touch' ? 8 : 6;
    const opacity = useTransform(scrollProgress, [0.48, 0.57, 0.92, 1], [0, 1, 1, 0.9]);
    const y = useTransform(scrollProgress, [0.48, 0.68, 1], [52, 20, 0]);
    const branchLength = useTransform(scrollProgress, [0.58, 0.7], [0, 1]);
    const dropLength = useTransform(scrollProgress, [0.62, 0.78], [0, 1]);
    const centerLineLength = useTransform(scrollProgress, [0.5, 0.78], [0, 1]);
    const dropArrowLength = useTransform(scrollProgress, [0.68, 0.82], [0, 1]);
    const nodeOpacity = useTransform(scrollProgress, [0.58, 0.66, 1], [0, 1, 1]);
    const nodeScale = useTransform(scrollProgress, [0.58, 0.68], [0.3, 1]);
    const collapseOpacity = useTransform(chapterProgress, [0.78, 0.81, 0.845], [1, 1, 0]);
    const collapseScaleY = useTransform(chapterProgress, [0.78, 0.845], [1, 0]);
    const collapseScaleX = useTransform(chapterProgress, [0.795, 0.845], [1, 0.94]);
    const collapseY = useTransform(chapterProgress, [0.78, 0.845], [0, -12]);

    return (
        <motion.div
            className={styles.strategyFlowOutro}
            style={
                reducedMotion
                    ? undefined
                    : {
                          opacity: collapseOpacity,
                          scaleX: collapseScaleX,
                          scaleY: collapseScaleY,
                          y: collapseY
                      }
            }
        >
            <motion.svg
                className={styles.strategyFlow}
                viewBox="0 0 600 146"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={reducedMotion ? undefined : { opacity, y }}
            >
                <defs>
                    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="62" y1="0" x2="538" y2="0">
                        <stop offset="0" stopColor="var(--layer-2)" stopOpacity="0.28" />
                        <stop offset="0.38" stopColor="var(--layer-3)" stopOpacity="0.76" />
                        <stop offset="0.5" stopColor="var(--text-primary)" />
                        <stop offset="0.62" stopColor="var(--layer-4)" stopOpacity="0.76" />
                        <stop offset="1" stopColor="var(--layer-2)" stopOpacity="0.28" />
                    </linearGradient>
                </defs>
                <motion.path
                    className={styles.strategyFlowLine}
                    d="M300 3 V156"
                    stroke={`url(#${gradientId})`}
                    style={reducedMotion ? undefined : { pathLength: centerLineLength }}
                />
                <motion.path
                    className={styles.strategyFlowLine}
                    d="M300 44 H60"
                    stroke={`url(#${gradientId})`}
                    style={reducedMotion ? undefined : { pathLength: branchLength }}
                />
                <motion.path
                    className={styles.strategyFlowLine}
                    d="M300 44 H540"
                    stroke={`url(#${gradientId})`}
                    style={reducedMotion ? undefined : { pathLength: branchLength }}
                />
                {branchPoints.map((point, index) => (
                    <g key={point}>
                        {point !== 300 && (
                            <motion.path
                                className={styles.strategyFlowDrop}
                                d={`M${point} 44 V${variant === 'touch' ? 100 : 75}`}
                                stroke={`url(#${gradientId})`}
                                style={reducedMotion ? undefined : { pathLength: dropLength }}
                            />
                        )}
                        <SymmetricArrowhead
                            className={`${styles.strategyFlowDropArrow} ${point === 300 ? styles.strategyFlowDropArrowCenter : ''}`}
                            x={point}
                            tipY={point === 300 ? 156 : variant === 'touch' ? 100 : 75}
                            shoulderY={point === 300 ? 142 : variant === 'touch' ? 88 : 63}
                            shoulderWidth={arrowShoulder}
                            stroke={`url(#${gradientId})`}
                            pathLength={dropArrowLength}
                            reducedMotion={reducedMotion}
                            animationDelay={`${index * 180}ms`}
                        />
                        <motion.circle
                            className={styles.strategyFlowBranchNode}
                            cx={point}
                            cy="44"
                            r="2.2"
                            style={reducedMotion ? undefined : { opacity: nodeOpacity, scale: nodeScale }}
                        />
                    </g>
                ))}
                <motion.circle
                    className={styles.strategyFlowNode}
                    cx="300"
                    cy="44"
                    r="3.4"
                    style={reducedMotion ? undefined : { opacity: nodeOpacity, scale: nodeScale }}
                />
            </motion.svg>
        </motion.div>
    );
}

// Kept intact so the chapter can be restored without rebuilding its animation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StrategyChapter({ variant, reducedMotion }: Required<HeroMessageProps>) {
    const chapterRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: chapterProgress } = useScroll({
        target: chapterRef,
        offset: ['start start', 'end end']
    });
    const activeEnd = variant === 'touch' ? 0.806 : 0.792;
    const holdEnd = variant === 'touch' ? 0.949 : 0.95;
    const scrollYProgress = useTransform(chapterProgress, [0, activeEnd, holdEnd, 1], [0, 0.94, 0.94, 1], { clamp: true });
    // Repeated output values turn scroll distance into deliberate visual holds:
    // strategy alone, then the completed hierarchy. Foreground collapse and the
    // word-bank hold are timed independently against chapter progress below.
    const animationProgress = useTransform(scrollYProgress, [0, 0.17, 0.31, 0.6, 0.78, 1], [0, 0.46, 0.46, 1, 1, 1], {
        clamp: true
    });
    const strategyOpacity = useTransform(animationProgress, [0, 0.26, 0.3, 0.4, 0.56, 0.66, 0.82, 1], [0, 0, 0.22, 1, 1, 0.18, 0.78, 1]);
    const strategyY = useTransform(
        animationProgress,
        [0, 0.26, 0.3, 0.46, 0.58, 0.68, 0.84, 1],
        [120, 120, 120, 0, 0, variant === 'touch' ? -46 : -70, variant === 'touch' ? -86 : -120, variant === 'touch' ? -92 : -128]
    );
    const strategyScale = useTransform(
        animationProgress,
        [0, 0.26, 0.3, 0.4, 0.47, 0.58, 0.68, 0.8, 1],
        [0.055, 0.055, 0.055, 1.12, 1, 1.03, 0.82, 0.5, 0.42]
    );
    const strategyLetterSpacing = useTransform(
        animationProgress,
        [0, 0.3, 0.46, 0.58, 0.68, 0.84, 1],
        ['0.04em', '0.04em', '-0.045em', '-0.025em', '0.08em', '0.04em', '0.02em']
    );
    const strategyFilter = useTransform(animationProgress, [0.58, 0.68, 0.82, 1], ['blur(0rem)', 'blur(1rem)', 'blur(0.2rem)', 'blur(0rem)']);
    const pathY = useTransform(animationProgress, [0.62, 0.88], [150, 105]);
    const strategyCollapseOpacity = useTransform(scrollYProgress, [0.79, 0.835, 0.855], [1, 0.3, 0]);
    const strategyCollapseY = useTransform(scrollYProgress, [0.79, 0.855], [0, 116]);
    const strategyCollapseScale = useTransform(scrollYProgress, [0.79, 0.855], [1, 0.075]);
    const strategyCollapseFilter = useTransform(scrollYProgress, [0.79, 0.855], ['blur(0rem)', 'blur(0.14rem)']);

    return (
        <div ref={chapterRef} className={styles.strategyChapter} data-variant={variant} data-reduced-motion={reducedMotion}>
            <div className={`${styles.narrativeSticky} ${styles.strategySticky}`}>
                <WordBankBg entranceProgress={animationProgress} chapterProgress={scrollYProgress} reducedMotion={reducedMotion} />
                <motion.div
                    className={styles.heroStrategyOutro}
                    style={
                        reducedMotion
                            ? undefined
                            : {
                                  opacity: strategyCollapseOpacity,
                                  y: strategyCollapseY,
                                  scale: strategyCollapseScale,
                                  filter: strategyCollapseFilter
                              }
                    }
                >
                    <motion.div
                        className={styles.heroStrategy}
                        aria-hidden="true"
                        style={
                            reducedMotion
                                ? undefined
                                : {
                                      opacity: strategyOpacity,
                                      y: strategyY,
                                      scale: strategyScale,
                                      letterSpacing: strategyLetterSpacing,
                                      filter: strategyFilter
                                  }
                        }
                    >
                        <SpotlightText text={HERO_STRATEGY} className={styles.heroStrategyLabel}>
                            {HERO_STRATEGY}
                        </SpotlightText>
                    </motion.div>
                </motion.div>
                <StrategyFlow variant={variant} scrollProgress={animationProgress} chapterProgress={scrollYProgress} reducedMotion={reducedMotion} />
                <motion.p className={styles.heroPath} aria-hidden="true" style={reducedMotion ? undefined : { y: pathY }}>
                    {HERO_PATH.map((item, index) => (
                        <PathSegment
                            key={item}
                            item={item}
                            index={index}
                            variant={variant}
                            scrollProgress={animationProgress}
                            chapterProgress={scrollYProgress}
                            reducedMotion={reducedMotion}
                        />
                    ))}
                </motion.p>
                <span className="sr-only">Strategy becoming interface, intelligence and infra.</span>
            </div>
            <Hold chapter="strategy" />
        </div>
    );
}

export function HeroMessage({ variant, reducedMotion = false }: HeroMessageProps) {
    return (
        <div className={styles.heroNarrative} data-variant={variant}>
            <StatementChapter variant={variant} reducedMotion={reducedMotion} />
            {/* <ClientChapter variant={variant} reducedMotion={reducedMotion} /> */}
            {/* <StrategyChapter variant={variant} reducedMotion={reducedMotion} /> */}
        </div>
    );
}
