import styles from './hero.module.scss';

export type HoldChapter = 'curtain' | 'statement' | 'client' | 'strategy';

export function Hold({ chapter }: { chapter: HoldChapter }) {
    return <div className={styles.chapterHold} data-chapter-hold={chapter} aria-hidden="true" />;
}
