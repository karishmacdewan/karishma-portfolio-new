'use client';

import Image from 'next/image';

import { MediaFrame } from '@/components/ui/MediaFrame';

import styles from './gallery.module.scss';
import type { Project } from './types';

function ClientLogoArtwork({ project, className }: { project: Project; className?: string }) {
    const client = project.client;
    if (!client) return null;

    return (
        <span className={`${styles.clientLogoArtwork} ${className ?? ''}`} data-brand={client.brand} aria-hidden="true">
            <span className={styles.clientLogoAura} />
            <span className={styles.clientLogoStage}>
                <Image src={client.logo} alt="" fill sizes="(max-width: 768px) 70vw, 46rem" className={styles.clientLogoHeroImage} />
            </span>
        </span>
    );
}

export function ProjectArtwork({ project, className, source }: { project: Project; className?: string; source?: string }) {
    const client = project.client;
    const logoOnly = project.cardArtwork === 'client-logo' && client;
    const currentSource = source ?? project.thumbnail[0];
    const containedArtwork = project.artworkFit === 'contain' || project.containedThumbnails?.includes(currentSource);
    const desktopCoverArtwork = project.desktopCoverThumbnails?.includes(currentSource);
    const artworkBackground = containedArtwork ? project.thumbnailBackgrounds?.[currentSource] ?? project.artworkBackground : undefined;
    const artworkScale = project.thumbnailScales?.[currentSource] ?? project.artworkScale;

    if (logoOnly) return <ClientLogoArtwork project={project} className={className} />;
    if (!currentSource) return null;
    if (client && currentSource === client.logo) return <ClientLogoArtwork project={project} className={className} />;

    return (
        <>
            {artworkBackground && <span className={styles.artworkBackground} style={{ backgroundColor: artworkBackground }} aria-hidden="true" />}
            <MediaFrame
                src={currentSource}
                height="600"
                width="800"
                className={`${className ?? ''} ${containedArtwork ? styles.containArtwork : ''} ${desktopCoverArtwork ? styles.desktopCoverArtwork : ''}`}
                style={artworkScale ? { transform: `scale(${artworkScale})` } : undefined}
                alt=""
            />
            {client && project.thumbnail.length === 1 && (
                <span className={styles.clientBadge} aria-label={`Client: ${client.name}`}>
                    <span className={styles.clientBadgeLogo} aria-hidden="true">
                        <Image src={client.logo} alt="" fill sizes="12rem" className={styles.clientBadgeImage} />
                    </span>
                </span>
            )}
        </>
    );
}
