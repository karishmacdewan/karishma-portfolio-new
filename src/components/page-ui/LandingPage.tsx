'use client';

import { useExperience } from '@/components/providers/ExperienceProvider';

import { DesktopHero } from './hero/DesktopHero';
import { MobileCurtainHero } from './hero/MobileCurtainHero';
import { TouchHero } from './hero/TouchHero';

export function LandingPage({
    onReady,
    onCurtainStop,
    onCurtainAdvance
}: {
    onReady?: () => void;
    onCurtainStop?: (top: number) => void;
    onCurtainAdvance?: (top: number) => void;
}) {
    const experience = useExperience();

    if (experience === 'desktop') {
        return <DesktopHero onReady={onReady} onCurtainStop={onCurtainStop} onCurtainAdvance={onCurtainAdvance} />;
    }
    if (experience === 'reduced') return <TouchHero reducedMotion onReady={onReady} />;

    return <MobileCurtainHero onReady={onReady} onCurtainStop={onCurtainStop} onCurtainAdvance={onCurtainAdvance} />;
}
