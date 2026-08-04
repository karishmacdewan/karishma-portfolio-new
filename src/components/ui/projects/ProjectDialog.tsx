'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { TechStack } from '@/components/ui/TechStack';
import { Reveal } from '@/components/ui/Reveal';

import { ProjectArtwork } from './ProjectArtwork';
import styles from './projects.module.scss';
import type { Project } from './types';

function getTimelineLabel(timeline: Project['timeline']) {
    if (!timeline) return null;
    if (typeof timeline === 'string') return timeline;

    return `${timeline.start} → ${timeline.end}`;
}

const REDACTED_HEADLINE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.';
const REDACTED_POINTS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
] as const;

export function ProjectDialog({
    project,
    children,
    redacted
}: {
    project: Project;
    children: ReactElement;
    redacted?: boolean;
}) {
    const isRedacted = redacted ?? project.redacted ?? false;
    const backdropSource = project.cardArtwork === 'client-logo' && project.client ? project.client.logo : project.thumbnail[0];
    const descriptionItems = isRedacted ? REDACTED_POINTS : Array.isArray(project.description) ? project.description : [project.description];
    const headline = isRedacted ? REDACTED_HEADLINE : project.headline;
    const timelineLabel = getTimelineLabel(project.timeline);
    const [titleLead, ...titleContextParts] = project.title.split('|');
    const titleContext = titleContextParts.join('|').trim();
    const [open, setOpen] = useState(false);

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger
                asChild
                onPointerDown={(event) => {
                    if (event.pointerType === 'mouse' && event.button === 0) setOpen(true);
                }}
            >
                {children}
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className={styles.liquidDialogOverlay} />
                <DialogPrimitive.Content className={styles.liquidDialogContent} data-client-brand={project.client?.brand}>
                    <div className={styles.liquidDialogBackdrop} aria-hidden="true">
                        <ProjectArtwork project={project} source={backdropSource} className={styles.liquidDialogBackdropMedia} />
                    </div>
                    <div className={styles.liquidDialogGlass} aria-hidden="true" />

                    <div className={styles.liquidDialogBody}>
                        <div className={styles.liquidDialogHeader}>
                            <div className={styles.liquidDialogHeading}>
                                <span className={styles.liquidDialogEyebrow}>Project preview</span>
                                <DialogPrimitive.Title className={styles.liquidDialogTitle}>
                                    <span className={styles.liquidDialogTitleLead}>{titleLead.trim().toLocaleUpperCase()}</span>
                                    {titleContext && (
                                        <>
                                            <span className={styles.liquidDialogTitleDivider} aria-hidden="true">
                                                |
                                            </span>
                                            <span className={styles.liquidDialogTitleContext}>{titleContext.toLocaleUpperCase()}</span>
                                        </>
                                    )}
                                </DialogPrimitive.Title>
                            </div>

                            {timelineLabel && (
                                <span className={styles.liquidDialogTimeline} aria-label={`Timeline: ${timelineLabel}`}>
                                    {timelineLabel}
                                </span>
                            )}
                        </div>

                        {isRedacted ? (
                            <Reveal width="100%" cover redacted>
                                <DialogPrimitive.Description className={styles.liquidDialogLead}>{headline}</DialogPrimitive.Description>
                            </Reveal>
                        ) : (
                            <DialogPrimitive.Description className={styles.liquidDialogLead}>{headline}</DialogPrimitive.Description>
                        )}

                        <ul className={styles.liquidDialogPoints}>
                            {descriptionItems.map((item, index) => (
                                <li key={`${index}-${item}`}>
                                    <span className={styles.liquidDialogPointArrow} aria-hidden="true">
                                        →
                                    </span>
                                    {isRedacted ? (
                                        <Reveal cover redacted>
                                            <span>{item}</span>
                                        </Reveal>
                                    ) : (
                                        <span>{item}</span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className={styles.liquidDialogFooter}>
                            {isRedacted ? (
                                <p className={styles.liquidDialogRedactedNotice}>Due to confidentiality, client data has been redacted.</p>
                            ) : (
                                project.warning && <p className={styles.liquidDialogWarning}>{project.warning}</p>
                            )}
                            {project.technologies.length > 0 && (
                                <div className={styles.liquidDialogTools}>
                                    <TechStack technologies={project.technologies} variant="chips" />
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogPrimitive.Close className={styles.liquidDialogClose} aria-label="Close project details">
                        <X aria-hidden="true" />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
