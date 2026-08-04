import { Slot, Slottable } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './outlinebutton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    children: ReactNode;
    icon?: ReactNode;
    size?: 'large' | 'medium' | 'small';
}

export function OutlineButton({ asChild = false, children, className, icon, size = 'medium', type, ...props }: Props) {
    const Component = asChild ? Slot : 'button';

    return (
        <Component className={`${styles.outlineButton} ${styles[size]} ${className ?? ''}`} type={asChild ? undefined : type ?? 'button'} {...props}>
            {icon}
            <Slottable>{children}</Slottable>
        </Component>
    );
}
