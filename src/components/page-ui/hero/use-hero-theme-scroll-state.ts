'use client';

import { useEffect, useState } from 'react';

const SCROLL_SETTLE_MS = 160;

export function useHeroThemeScrollState() {
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let timeout = 0;

        const handleScroll = () => {
            setIsScrolling(true);
            document.documentElement.dataset.themeScrolling = 'true';
            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                setIsScrolling(false);
                delete document.documentElement.dataset.themeScrolling;
            }, SCROLL_SETTLE_MS);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.clearTimeout(timeout);
            delete document.documentElement.dataset.themeScrolling;
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isScrolling;
}
