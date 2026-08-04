'use client';

import { useSyncExternalStore } from 'react';

export type ExperienceMode = 'desktop' | 'touch' | 'reduced';
export type DetectedExperienceMode = ExperienceMode | null;

export const DESKTOP_MIN_WIDTH = 1280;

export const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px) and (hover: hover) and (pointer: fine)`;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getExperienceMode(): DetectedExperienceMode {
    if (typeof window === 'undefined') {
        return null;
    }

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        return 'reduced';
    }

    const hasDesktopCapabilities = window.matchMedia(DESKTOP_QUERY).matches && navigator.maxTouchPoints === 0;

    return hasDesktopCapabilities ? 'desktop' : 'touch';
}

function subscribe(onStoreChange: () => void) {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    const mediaQueries = [window.matchMedia(DESKTOP_QUERY), window.matchMedia(REDUCED_MOTION_QUERY)];

    mediaQueries.forEach((query) => query.addEventListener('change', onStoreChange));

    return () => {
        mediaQueries.forEach((query) => query.removeEventListener('change', onStoreChange));
    };
}

export function useExperienceMode() {
    return useSyncExternalStore<DetectedExperienceMode>(subscribe, getExperienceMode, () => null);
}
