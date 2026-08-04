'use client';

import { useExperience } from '@/components/providers/ExperienceProvider';

import { DesktopProjectGallery } from './DesktopProjectGallery';
import { TouchProjectGrid } from './TouchProjectGrid';
import type { Project } from './types';

export function ProjectGallery({ products, onReady }: { products: Project[]; onReady?: () => void }) {
    const experience = useExperience();

    if (experience === 'desktop') {
        return <DesktopProjectGallery products={products} onReady={onReady} />;
    }

    return <TouchProjectGrid products={products} onReady={onReady} />;
}
