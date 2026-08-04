'use client';

import { useEffect } from 'react';

import { Reveal } from '@/components/ui/Reveal';

import styles from './gallery.module.scss';
import { ProjectArtwork } from './ProjectArtwork';
import type { Project } from './types';

export function TouchProjectGrid({ products, onReady }: { products: Project[]; onReady?: () => void }) {
    useEffect(() => {
        onReady?.();
    }, [onReady]);

    return (
        <div className={styles.touchTileWall} aria-label="Clients and experience">
            <div className={styles.touchTileGrid}>
                {products.map((project, index) => (
                    <div key={project.title} className={styles.touchTileItem}>
                        <Reveal width="100%" delay={(index % 4) * 0.035} overflow="visible">
                            <div className={`${styles.touchCard} ${styles.touchTile}`} role="img" aria-label={project.title}>
                                <ProjectArtwork project={project} className={styles.cardMedia} />
                            </div>
                        </Reveal>
                    </div>
                ))}
            </div>
        </div>
    );
}
