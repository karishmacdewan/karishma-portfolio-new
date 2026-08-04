import Link from 'next/link';

import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/Dialog';
import { OutlineButton } from '@/components/ui/OutlineButton/OutlineButton';
import { Reveal } from '@/components/ui/Reveal';
import { TechStack } from '@/components/ui/TechStack';

import { ProjectArtwork } from './ProjectArtwork';
import styles from './projects.module.scss';
import type { Project } from './types';

export function ProjectDetail({ project }: { project: Project }) {
    return (
        <DialogContent className={styles.dialogContent}>
            <DialogHeader className={styles.dialogHeader}>
                <Reveal width="100%">
                    <DialogTitle className={styles.dialogTitle}>{project.title}</DialogTitle>
                </Reveal>
                <DialogDescription className={styles.headline}>{project.headline}</DialogDescription>
            </DialogHeader>

            <div className={styles.centered}>
                <ProjectArtwork project={project} className={styles.projectMedia} />
            </div>

            <div className={styles.description}>
                {Array.isArray(project.description) ? (
                    <ul className={styles.descriptionList}>
                        {project.description.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>{project.description}</p>
                )}
            </div>

            <TechStack technologies={project.technologies} variant="chips" />

            {project.warning && (
                <Alert variant="destructive" className={styles.warning}>
                    <AlertTitle>Please note</AlertTitle>
                    <AlertDescription>{project.warning}</AlertDescription>
                </Alert>
            )}

            {(project.projectLink || project.githubLink) && (
                <DialogFooter className={styles.dialogFooter}>
                    {project.projectLink && (
                        <OutlineButton asChild>
                            <Link href={project.projectLink} target="_blank" rel="noopener noreferrer">
                                View project
                            </Link>
                        </OutlineButton>
                    )}
                    {project.githubLink && (
                        <OutlineButton asChild>
                            <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                View GitHub
                            </Link>
                        </OutlineButton>
                    )}
                </DialogFooter>
            )}
        </DialogContent>
    );
}
