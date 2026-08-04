'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { type ExperienceMode, useExperienceMode } from '@/hooks/use-experience-mode';

interface ExperienceState {
    mode: ExperienceMode | null;
}

const ExperienceContext = createContext<ExperienceState>({
    mode: null
});

export function ExperienceProvider({ children }: { children: ReactNode }) {
    const mode = useExperienceMode();

    const value = useMemo<ExperienceState>(() => ({ mode }), [mode]);

    return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
    return useContext(ExperienceContext).mode ?? 'touch';
}

export function useExperienceState() {
    return useContext(ExperienceContext);
}
