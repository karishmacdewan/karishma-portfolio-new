'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import styles from './mobile-nav.module.scss';

const navigationItems = [
    // { href: '#about', label: 'about' },
    { href: '#projects', label: 'projects' },
    // { href: '#experience', label: 'experience' },
    { href: '#contact', label: 'contact' }
] as const;

export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <header className={styles.header}>
            <a href="#home" className={styles.logo} aria-label="Back to the top">
                gd<span>.</span>
            </a>

            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <button type="button" className={styles.menuButton} aria-label="Open navigation">
                        <Menu aria-hidden="true" />
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.overlay} />
                    <Dialog.Content className={styles.menu} aria-describedby={undefined}>
                        <div className={styles.menuHeader}>
                            <Dialog.Title>Navigate</Dialog.Title>
                            <Dialog.Close asChild>
                                <button type="button" className={styles.menuButton} aria-label="Close navigation">
                                    <X aria-hidden="true" />
                                </button>
                            </Dialog.Close>
                        </div>
                        <nav aria-label="Mobile navigation">
                            {navigationItems.map((item, index) => (
                                <a key={item.href} href={item.href} className={styles.menuLink} onClick={() => setOpen(false)}>
                                    <span aria-hidden="true">0{index + 1}</span>
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </header>
    );
}
