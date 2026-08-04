'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import styles from './sidebar.module.scss';

const navigationItems = [
    // { id: 'about', label: 'about' },
    { id: 'projects', label: 'projects' },
    // { id: 'experience', label: 'experience' },
    { id: 'contact', label: 'contact' }
] as const;

type NavigationId = 'home' | (typeof navigationItems)[number]['id'];

export function SideBar() {
    const [selected, setSelected] = useState<NavigationId>('home');

    useEffect(() => {
        const sectionIds: NavigationId[] = ['home', ...navigationItems.map(({ id }) => id)];
        const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
        let animationFrame = 0;

        const updateSelectedSection = () => {
            animationFrame = 0;

            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
                setSelected('contact');
                return;
            }

            const marker = window.innerHeight * 0.4;
            const activeSection = sections.find((section) => {
                const bounds = section.getBoundingClientRect();
                return bounds.top <= marker && bounds.bottom > marker;
            });

            if (activeSection) setSelected(activeSection.id as NavigationId);
        };

        const scheduleUpdate = () => {
            if (animationFrame) return;
            animationFrame = requestAnimationFrame(updateSelectedSection);
        };

        scheduleUpdate();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, []);

    return (
        <div style={{ background: 'var(--background-dark)' }}>
            <motion.nav
                aria-label="Primary navigation"
                initial={{ x: -70 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.sideBar}
            >
                <a
                    href="#home"
                    aria-label="Back to the top"
                    className={`${styles.logo} ${selected === 'home' ? styles.logoSelected : ''}`}
                    onClick={() => setSelected('home')}
                    aria-current={selected === 'home' ? 'location' : undefined}
                >
                    gd<span>.</span>
                </a>

                {navigationItems.map((item, index) => (
                    <motion.a
                        key={item.id}
                        initial={{ x: -70 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                        href={`#${item.id}`}
                        onClick={() => setSelected(item.id)}
                        className={selected === item.id ? styles.selected : ''}
                        aria-current={selected === item.id ? 'location' : undefined}
                    >
                        {item.label}
                    </motion.a>
                ))}
            </motion.nav>
        </div>
    );
}
