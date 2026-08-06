'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import styles from './intro-chapter.module.scss';

type ImpactPoint = {
    id: string;
    metric: ReactNode;
    description: string;
};

type CapabilityGroup = {
    title: string;
    description: ReactNode;
};

type IntroChapterProps = {
    onScrollTo?: (top: number, durationMs: number) => void;
};

const impactPoints = [
    {
        id: '10-years',
        metric: '10+ years',
        description: 'leading strategy, data and digital transformation across Google, Amazon and global enterprises'
    },
    {
        id: '200-plus',
        metric: '200+',
        description: 'GenAI use cases taken into a governed, scalable path to production'
    },
    {
        id: '60-faster',
        metric: '60% faster',
        description: 'from proof of concept to production through AI operating-model redesign'
    },
    {
        id: '25000-plus',
        metric: '25,000+',
        description: 'daily users reached through a firm-wide GenAI rollout'
    },
    {
        id: '500m-plus',
        metric: '$500M+',
        description: 'in annual investment influenced through C-level strategy and advisory'
    },
    {
        id: '367m',
        metric: '$367M',
        description: 'in retail-partner profitability unlocked through data-led growth strategy'
    }
] satisfies ImpactPoint[];

const capabilityGroups = [
    {
        title: 'AI operating models',
        description: (
            <>
                {'Governance, ownership, evaluation and compliance designed for enterprise scale'}
                <span className={styles.accent}>.</span>
            </>
        )
    },
    {
        title: 'Architecture & delivery',
        description: (
            <>
                {'Agents, RAG, knowledge graphs, ingestion pipelines and AI evaluation platforms'}
                <span className={styles.accent}>.</span>
            </>
        )
    },
    {
        title: 'Commercialisation',
        description: (
            <>
                {'Business cases, product strategy, go-to-market and executive adoption'}
                <span className={styles.accent}>.</span>
            </>
        )
    }
] satisfies CapabilityGroup[];

function useThresholdReveal<TElement extends HTMLElement>(startRatio = 0.84, resetRatio = 0.88, reducedMotion = false) {
    const ref = useRef<TElement>(null);
    const [revealed, setRevealed] = useState(reducedMotion);

    useEffect(() => {
        if (reducedMotion) {
            setRevealed(true);
            return;
        }

        let frame = 0;
        const update = () => {
            frame = 0;
            const element = ref.current;
            if (!element) return;

            const top = element.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            if (top <= viewportHeight * startRatio) {
                setRevealed(true);
                return;
            }

            if (top > viewportHeight * resetRatio) setRevealed(false);
        };
        const requestUpdate = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, [reducedMotion, resetRatio, startRatio]);

    return { ref, revealed };
}

function ImpactItem({ point, index, reducedMotion }: { point: ImpactPoint; index: number; reducedMotion: boolean }) {
    const { ref, revealed } = useThresholdReveal<HTMLElement>(0.84, 0.88, reducedMotion);
    const delay = reducedMotion ? 0 : (index % 2) * 0.035;

    return (
        <article className={styles.impactItem} ref={ref}>
            <motion.span
                className={styles.metricRule}
                aria-hidden="true"
                initial={false}
                animate={revealed ? 'shown' : 'hidden'}
                variants={impactVariants}
                transition={{ ...impactTransition, delay }}
            />
            <motion.h3
                className={styles.metric}
                initial={false}
                animate={revealed ? 'shown' : 'hidden'}
                variants={impactVariants}
                transition={{ ...impactTransition, delay }}
            >
                {point.metric}
            </motion.h3>
            <motion.p
                className={styles.description}
                initial={false}
                animate={revealed ? 'shown' : 'hidden'}
                variants={impactVariants}
                transition={{ ...impactTransition, delay: delay + 0.07 }}
            >
                {point.description}
            </motion.p>
        </article>
    );
}

function CapabilityColumn({ group, index, reducedMotion }: { group: CapabilityGroup; index: number; reducedMotion: boolean }) {
    const { ref, revealed } = useThresholdReveal<HTMLElement>(0.83, 0.88, reducedMotion);

    return (
        <motion.article
            className={styles.capability}
            ref={ref}
            initial={false}
            animate={revealed ? 'shown' : 'hidden'}
            variants={capabilityVariants}
            transition={{
                ...capabilityTransition,
                delay: reducedMotion ? 0 : index * 0.06
            }}
        >
            <h3 className={styles.capabilityTitle}>{group.title}</h3>
            <p className={styles.capabilityDescription}>{group.description}</p>
        </motion.article>
    );
}

const impactVariants = {
    hidden: {
        opacity: 0,
        y: 14,
        filter: 'blur(4px)'
    },
    shown: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
    }
};

const capabilityVariants = {
    hidden: {
        opacity: 0,
        y: 16,
        filter: 'blur(3px)'
    },
    shown: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
    }
};

const impactTransition = {
    duration: 0.42,
    ease: [0.22, 1, 0.36, 1] as const
};

const capabilityTransition = {
    duration: 0.48,
    ease: [0.22, 1, 0.36, 1] as const
};

export function IntroChapter(_props: IntroChapterProps) {
    const reducedMotion = Boolean(useReducedMotion());
    const { ref: whatIBringEyebrowRef, revealed: whatIBringEyebrowRevealed } = useThresholdReveal<HTMLParagraphElement>(0.83, 0.88, reducedMotion);

    return (
        <section className={styles.chapter} aria-labelledby="intro-chapter-title" data-reduced-motion={reducedMotion}>
            <h2 id="intro-chapter-title" className="sr-only">
                Selected impact and what I bring
            </h2>

            <div className={styles.stage}>
                <section className={styles.impactSection} aria-labelledby="selected-impact-heading">
                    <div className={styles.impactInner}>
                        <p id="selected-impact-heading" className={styles.eyebrow}>
                            SELECTED IMPACT
                        </p>
                        <div className={styles.impactGrid}>
                            {impactPoints.map((point, index) => (
                                <ImpactItem key={point.id} point={point} index={index} reducedMotion={reducedMotion} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.whatIBringSection} aria-labelledby="what-i-bring-heading">
                    <div className={styles.whatIBringInner}>
                        <motion.p
                            id="what-i-bring-heading"
                            className={styles.eyebrow}
                            ref={whatIBringEyebrowRef}
                            initial={false}
                            animate={whatIBringEyebrowRevealed ? 'shown' : 'hidden'}
                            variants={capabilityVariants}
                            transition={capabilityTransition}
                        >
                            WHAT I BRING
                        </motion.p>
                        <div className={styles.whatIBringGrid}>
                            {capabilityGroups.map((group, index) => (
                                <CapabilityColumn key={group.title} group={group} index={index} reducedMotion={reducedMotion} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
