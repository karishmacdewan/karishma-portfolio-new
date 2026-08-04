'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import styles from './ModeToggle.module.scss';

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === 'dark' : true;
    const nextTheme = isDark ? 'light' : 'dark';

    return (
        <button type="button" className={styles.modeToggle} onClick={() => setTheme(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}>
            <svg className={styles.modeIcon} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 3.5a8.5 8.5 0 0 0 0 17z" />
            </svg>
        </button>
    );
}
