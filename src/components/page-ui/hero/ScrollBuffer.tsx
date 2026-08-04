import styles from './hero.module.scss';

export function ScrollBuffer({ chapter }: { chapter: 'curtain' | 'statement' | 'strategy' }) {
    return <div className={styles.scrollBuffer} data-scroll-buffer={chapter} aria-hidden="true" />;
}
