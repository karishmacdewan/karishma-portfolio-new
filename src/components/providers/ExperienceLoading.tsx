import { instrumentSerifRegular } from '@/lib/fonts';

import styles from './experience-loading.module.scss';

interface ExperienceLoadingProps {
    transition?: boolean;
    exiting?: boolean;
    onExitComplete?: () => void;
}

export function ExperienceLoading({ transition = false, exiting = false, onExitComplete }: ExperienceLoadingProps) {
    return (
        <div
            className={styles.loading}
            data-transition={transition}
            data-exiting={exiting}
            role="status"
            aria-live="polite"
            aria-label={transition ? 'Adapting layout to the new screen size' : 'Building the experience'}
            onAnimationEnd={(event) => {
                if (exiting && event.target === event.currentTarget) onExitComplete?.();
            }}
        >
            <div className={styles.content} aria-hidden="true">
                <span className={`${instrumentSerifRegular.className} ${styles.logo}`}>
                    karishma<span>.</span>
                </span>
                <span className={styles.track}>
                    <span />
                </span>
                <span className={styles.label}>{transition ? 'adapting view' : 'building the experience'}</span>
            </div>
        </div>
    );
}
