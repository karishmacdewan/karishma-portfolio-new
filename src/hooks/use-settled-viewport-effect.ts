'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_SETTLE_DELAY = 420;

/** Runs viewport-sensitive repair work only after resize/fullscreen activity settles. */
export function useSettledViewportEffect(callback: () => void, active = true, delay = DEFAULT_SETTLE_DELAY) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!active) return;

        let timeout = 0;
        let frame = 0;

        const run = () => {
            timeout = 0;
            if (document.visibilityState === 'hidden' || window.innerWidth <= 0 || window.innerHeight <= 0) return;

            frame = window.requestAnimationFrame(() => {
                frame = 0;
                callbackRef.current();
            });
        };

        const schedule = () => {
            window.clearTimeout(timeout);
            window.cancelAnimationFrame(frame);
            timeout = window.setTimeout(run, delay);
        };

        window.addEventListener('resize', schedule, { passive: true });
        window.addEventListener('orientationchange', schedule, {
            passive: true
        });
        window.addEventListener('focus', schedule, { passive: true });
        window.addEventListener('pageshow', schedule, { passive: true });
        window.visualViewport?.addEventListener('resize', schedule, {
            passive: true
        });
        document.addEventListener('fullscreenchange', schedule);
        document.addEventListener('visibilitychange', schedule);

        return () => {
            window.clearTimeout(timeout);
            window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', schedule);
            window.removeEventListener('orientationchange', schedule);
            window.removeEventListener('focus', schedule);
            window.removeEventListener('pageshow', schedule);
            window.visualViewport?.removeEventListener('resize', schedule);
            document.removeEventListener('fullscreenchange', schedule);
            document.removeEventListener('visibilitychange', schedule);
        };
    }, [active, delay]);
}
