import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { CLIENT_CAROUSEL_MODE_EVENT, type ClientCarouselMode } from '@/components/page-ui/hero/events';

import styles from './company-marquee.module.scss';

const companies = [
    { name: 'Stripe', logo: '/client-logos/stripe.webp' },
    { name: 'Deloitte', logo: '/client-logos/deloitte.png', logoClass: 'deloitte' },
    { name: 'UK Government', logo: '/client-logos/uk-government.png', logoClass: 'ukGovernment' },
    { name: 'Deutsche Bank', logo: '/client-logos/deutsche-bank-black-logo.png', logoClass: 'deutscheBank' },
    { name: 'Barclays', logo: '/client-logos/barclays.webp', logoClass: 'barclays' },
    { name: 'NEOM', logo: '/client-logos/neom-logo.png' },
    { name: 'Spotify', logo: '/client-logos/spotify.png' },
    { name: 'First Abu Dhabi Bank', logo: '/client-logos/first-abu-dhabi-bank.webp' }
];

function CompanyList({ duplicate = false, mode, primary = false }: { duplicate?: boolean; mode: ClientCarouselMode; primary?: boolean }) {
    return (
        <div className={styles.companyList} data-primary={primary} aria-hidden={duplicate || undefined}>
            {companies.map((company, index) => (
                <motion.div
                    key={company.name}
                    className={styles.company}
                    data-company={company.name.toLowerCase().replaceAll(' ', '-')}
                    initial={false}
                    animate={primary ? (mode === 'showcase' ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 16 }) : undefined}
                    transition={{
                        opacity: { duration: 0.5, delay: mode === 'showcase' ? index * 0.075 : 0 },
                        scale: { duration: 0.65, delay: mode === 'showcase' ? index * 0.075 : 0 },
                        y: { duration: 0.65, delay: mode === 'showcase' ? index * 0.075 : 0 }
                    }}
                >
                    <span className={styles.logoFloat}>
                        <Image
                            src={company.logo}
                            alt={duplicate ? '' : company.name}
                            fill
                            sizes={mode === 'showcase' ? '(max-width: 768px) 42vw, 24vw' : '(max-width: 768px) 160px, 240px'}
                            className={company.logoClass ? styles[company.logoClass] : undefined}
                            draggable={false}
                        />
                    </span>
                </motion.div>
            ))}
        </div>
    );
}

export function CompanyMarquee() {
    const [mode, setMode] = useState<ClientCarouselMode>('hidden');
    const [marqueeActive, setMarqueeActive] = useState(false);

    useEffect(() => {
        const updateMode = (event: Event) => {
            const { mode: nextMode } = (event as CustomEvent<{ mode: ClientCarouselMode }>).detail;
            setMode(nextMode);
        };

        window.addEventListener(CLIENT_CAROUSEL_MODE_EVENT, updateMode);

        return () => window.removeEventListener(CLIENT_CAROUSEL_MODE_EVENT, updateMode);
    }, []);

    useEffect(() => {
        if (mode !== 'footer') {
            setMarqueeActive(false);
            return;
        }

        const timeout = window.setTimeout(() => setMarqueeActive(true), 1150);
        return () => window.clearTimeout(timeout);
    }, [mode]);

    return (
        <aside
            className={styles.marquee}
            aria-label="Selected clients"
            aria-hidden={mode === 'hidden'}
            data-mode={mode}
            data-marquee-active={marqueeActive}
        >
            <div className={styles.showcaseLayer} aria-hidden={mode !== 'showcase'}>
                <CompanyList mode={mode} primary />
            </div>
            <div className={styles.bannerLayer} aria-hidden={mode !== 'footer'}>
                <div className={styles.viewport}>
                    <div className={styles.track}>
                        <CompanyList mode={mode} />
                        <CompanyList mode={mode} duplicate />
                    </div>
                </div>
            </div>
        </aside>
    );
}
