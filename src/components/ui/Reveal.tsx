'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useExperience } from '@/components/providers/ExperienceProvider';

interface Props {
    children: ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    overflow?: 'hidden' | 'visible';
    cover?: boolean;
    redacted?: boolean;
}

export function Reveal({ children, width = 'fit-content', delay = 0, overflow = 'hidden', cover = false, redacted = false }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0, margin: '0px 0px -8% 0px' });
    const reducedMotion = useReducedMotion();
    const experience = useExperience();
    const [hasRevealed, setHasRevealed] = useState(false);
    const visible = Boolean(reducedMotion) || hasRevealed;
    const showMask = redacted || ((experience === 'desktop' || cover) && !reducedMotion);

    useEffect(() => {
        if (reducedMotion || isInView) {
            setHasRevealed(true);
            return;
        }

        const element = ref.current;
        if (!element || hasRevealed) return;

        let animationFrame = 0;

        const revealIfReached = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                const bounds = element.getBoundingClientRect();
                const revealLine = window.innerHeight * 0.92;

                if (bounds.top <= revealLine) {
                    setHasRevealed(true);
                }
            });
        };

        revealIfReached();
        window.addEventListener('scroll', revealIfReached, { passive: true });
        window.addEventListener('resize', revealIfReached);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', revealIfReached);
            window.removeEventListener('resize', revealIfReached);
        };
    }, [hasRevealed, isInView, reducedMotion]);

    return (
        <div ref={ref} style={{ position: 'relative', width, overflow }} data-redacted={redacted || undefined}>
            <motion.div
                aria-hidden={redacted || undefined}
                initial={reducedMotion ? 'visible' : 'hidden'}
                animate={visible ? 'visible' : 'hidden'}
                variants={{
                    hidden: { opacity: 0, y: 48 },
                    visible: { opacity: 1, y: 0 }
                }}
                transition={{
                    duration: reducedMotion ? 0 : 0.5,
                    delay,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                {children}
            </motion.div>
            {showMask && (
                <motion.div
                    aria-hidden="true"
                    data-reveal-mask="true"
                    data-redacted={redacted || undefined}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: redacted ? 1 : visible ? 0 : 1 }}
                    transition={{ duration: 0.5, delay, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: '4px 0',
                        border: redacted ? '1px solid rgb(251 113 133 / 22%)' : undefined,
                        borderRadius: redacted ? '0.5rem' : undefined,
                        background: redacted
                            ? 'linear-gradient(105deg, #3f0715 0%, #881337 44%, #be123c 54%, #4c0519 100%)'
                            : 'var(--brand)',
                        boxShadow: redacted
                            ? '0 0 1.4rem rgb(225 29 72 / 24%), inset 0 1px 0 rgb(251 113 133 / 22%), inset 0 -1px 0 rgb(76 5 25 / 80%)'
                            : undefined,
                        zIndex: 20,
                        pointerEvents: 'none',
                        transformOrigin: 'right center',
                        willChange: 'transform'
                    }}
                />
            )}
        </div>
    );
}
