import { Laptop } from 'lucide-react';

import styles from './desktop-preference-hint.module.scss';

export function DesktopPreferenceHint() {
    return (
        <aside className={styles.hint} aria-label="This portfolio is better experienced on desktop">
            <span>better on desktop</span>
            <Laptop aria-hidden="true" />
        </aside>
    );
}
