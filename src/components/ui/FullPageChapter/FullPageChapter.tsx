import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import styles from './full-page-chapter.module.scss';

interface FullPageChapterProps {
    id: string;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    labelledBy?: string;
}

export function FullPageChapter({ id, children, className, contentClassName, labelledBy }: FullPageChapterProps) {
    return (
        <section id={id} className={cn(styles.chapter, className)} aria-labelledby={labelledBy} data-full-page-chapter>
            <div className={cn(styles.content, contentClassName)}>{children}</div>
        </section>
    );
}
