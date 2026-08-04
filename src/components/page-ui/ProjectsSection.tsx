import { FullPageChapter } from '@/components/ui/FullPageChapter/FullPageChapter';
import { ProjectGallery } from '@/components/ui/projects/ProjectGallery';
import { projects } from '@/data/projects';

import styles from './projects-section.module.scss';

export function ProjectsSection({ onReady }: { onReady?: () => void }) {
    return (
        <FullPageChapter id="projects" className={styles.section} contentClassName={styles.content} labelledBy="projects-chapter-title">
            <div className={styles.heading}>
                <div className={styles.headingRow}>
                    <h2 className={styles.title} id="projects-chapter-title">
                        Selected organisations<span>.</span>
                    </h2>
                    <span className={styles.divider} aria-hidden="true" />
                </div>
                <p className={styles.subtitle}>
                    Across leadership roles, consulting engagements and strategic client partnerships spanning AI, transformation and growth.
                </p>
            </div>
            <div className={styles.clientGrid}>
                <ProjectGallery products={projects} onReady={onReady} />
            </div>
        </FullPageChapter>
    );
}
