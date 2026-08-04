'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { FullPageChapter } from '@/components/ui/FullPageChapter/FullPageChapter';

import styles from './contact.module.scss';

const EMAIL_ADDRESS = 'karishmadewan@gmail.com';
const EMAIL_URL = `mailto:${EMAIL_ADDRESS}`;
const LINKEDIN_URL = 'https://www.linkedin.com/in/karishmacdewan/';

const revealTransition = {
    duration: 0.64,
    ease: [0.22, 1, 0.36, 1] as const
};

function ContactReveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.32 });
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={reducedMotion ? false : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={reducedMotion || isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            transition={{ ...revealTransition, delay: reducedMotion ? 0 : delay }}
        >
            {children}
        </motion.div>
    );
}

export const Contact = () => {
    return (
        <FullPageChapter id="contact" className={styles.contactSection} contentClassName={styles.contactContent} labelledBy="contact-chapter-title">
            <div className={styles.contactInner}>
                <div className={styles.leftColumn}>
                    <p className={styles.eyebrow}>CONTACT</p>
                    <ContactReveal>
                        <h2 id="contact-chapter-title" className={styles.statement}>
                            <span className={styles.statementLine}>Let&apos;s move AI</span>
                            <span className={styles.statementLine}>from ambition</span>
                            <span className={styles.statementLine}>
                                to adoption<span className={styles.statementAccent}>.</span>
                            </span>
                        </h2>
                    </ContactReveal>
                    <ContactReveal delay={0.1}>
                        <p className={styles.supportingCopy}>
                            For transformation programmes, advisory engagements, product work and selected leadership roles.
                        </p>
                    </ContactReveal>
                </div>

                <div className={styles.contactActions}>
                    <ContactReveal delay={0.24} className={styles.actionReveal}>
                        <Link className={styles.emailCard} href={EMAIL_URL} aria-label={`Start a conversation by emailing ${EMAIL_ADDRESS}`}>
                            <span className={styles.emailCardContent}>
                                <span className={styles.cardTopline}>START A CONVERSATION</span>
                                <span className={styles.emailAddress}>{EMAIL_ADDRESS}</span>
                            </span>
                            <ArrowUpRight className={styles.cardArrow} aria-hidden="true" />
                        </Link>
                    </ContactReveal>

                    <ContactReveal delay={0.32} className={styles.actionReveal}>
                        <Link className={styles.linkedinCard} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                            <span className={styles.linkedinCopy}>
                                <Linkedin className={styles.linkedinIcon} aria-hidden="true" />
                                <span>Connect on LinkedIn</span>
                            </span>
                            <ArrowUpRight className={styles.cardArrow} aria-hidden="true" />
                        </Link>
                    </ContactReveal>
                </div>

                <div className={styles.contactMeta}>
                    <span className={styles.availability}>
                        <span className={styles.metaDot} aria-hidden="true" />
                        <span>Available for select engagements</span>
                    </span>
                </div>
            </div>
        </FullPageChapter>
    );
};
