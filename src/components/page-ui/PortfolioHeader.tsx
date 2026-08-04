'use client';

import { ModeToggle } from '@/components/page-ui/ModeToggle';
import { instrumentSerifRegular } from '@/lib/fonts';

import styles from './PortfolioHeader.module.scss';

export function PortfolioHeader() {
    return (
        <header className={styles.siteHeader} aria-label="Site header">
            <div className={styles.themeControl}>
                <ModeToggle />
            </div>
            <a href="#home" className={`${instrumentSerifRegular.className} ${styles.wordmark}`} aria-label="Back to the top">
                karishma<span>.</span>
            </a>
        </header>
    );
}
