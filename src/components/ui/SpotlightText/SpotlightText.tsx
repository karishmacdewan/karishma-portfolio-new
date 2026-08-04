'use client';

import clsx from 'clsx';
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useEffect, useRef } from 'react';

import styles from './spotlight-text.module.scss';

type PointerSubscriber = (x: number, y: number) => void;

const pointerSubscribers = new Set<PointerSubscriber>();
let isListening = false;
let lastPointer: { x: number; y: number } | null = null;
let pointerFrame = 0;

function schedulePointerUpdate() {
    if (!lastPointer || pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!lastPointer) return;
        pointerSubscribers.forEach((subscriber) => subscriber(lastPointer!.x, lastPointer!.y));
    });
}

function trackPointer(event: PointerEvent) {
    lastPointer = { x: event.clientX, y: event.clientY };
    schedulePointerUpdate();
}

function subscribeToPointer(subscriber: PointerSubscriber) {
    pointerSubscribers.add(subscriber);

    if (!isListening) {
        window.addEventListener('pointermove', trackPointer, { passive: true });
        window.addEventListener('scroll', schedulePointerUpdate, { passive: true });
        window.addEventListener('resize', schedulePointerUpdate, { passive: true });
        isListening = true;
    }

    if (lastPointer) subscriber(lastPointer.x, lastPointer.y);

    return () => {
        pointerSubscribers.delete(subscriber);

        if (pointerSubscribers.size === 0 && isListening) {
            window.removeEventListener('pointermove', trackPointer);
            window.removeEventListener('scroll', schedulePointerUpdate);
            window.removeEventListener('resize', schedulePointerUpdate);
            window.cancelAnimationFrame(pointerFrame);
            pointerFrame = 0;
            isListening = false;
        }
    };
}

type SpotlightTextProps<T extends ElementType> = {
    as?: T;
    children: ReactNode;
    className?: string;
    text: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function SpotlightText<T extends ElementType = 'span'>({ as, children, className, text, ...props }: SpotlightTextProps<T>) {
    const Component = as ?? 'span';
    const elementRef = useRef<HTMLElement | null>(null);
    const isVisibleRef = useRef(true);

    useEffect(() => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (!entry.isIntersecting) element.dataset.spotlightHovered = 'false';
            },
            { rootMargin: '160px' }
        );
        observer.observe(element);

        const unsubscribe = subscribeToPointer((pointerX, pointerY) => {
            if (!isVisibleRef.current) return;

            const bounds = element.getBoundingClientRect();
            if (bounds.width === 0 || bounds.height === 0) return;

            const isHovered = pointerX >= bounds.left && pointerX <= bounds.right && pointerY >= bounds.top && pointerY <= bounds.bottom;
            const rawX = ((pointerX - bounds.left) / bounds.width) * 100;
            const rawY = ((pointerY - bounds.top) / bounds.height) * 100;
            const x = Math.min(112, Math.max(-12, rawX));
            const y = Math.min(135, Math.max(-35, rawY));

            element.style.setProperty('--spotlight-x', `${x}%`);
            element.style.setProperty('--spotlight-y', `${y}%`);
            element.dataset.spotlightHovered = String(isHovered);
        });

        return () => {
            observer.disconnect();
            unsubscribe();
        };
    }, []);

    return (
        <Component {...props} ref={elementRef} className={clsx(styles.spotlightText, className)} data-spotlight-text={text}>
            {children}
        </Component>
    );
}
