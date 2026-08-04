'use client';

import { type MotionValue, useMotionValueEvent } from 'framer-motion';
import { type RefObject, useCallback, useEffect, useRef } from 'react';

import { DO_THUNDERBOLT_ANIM } from './config';

type GatePhase = 'approaching' | 'held' | 'released';

const WHEEL_GESTURE_PAUSE_MS = 70;
const NEW_IMPULSE_ARM_MS = 140;
const THUNDER_DURATION_MS = 1000;
const REARM_MARGIN = 0.025;
const FORWARD_SCROLL_KEYS = new Set([' ', 'ArrowDown', 'End', 'PageDown']);

interface CurtainGestureGateOptions {
    chapterRef: RefObject<HTMLElement>;
    curtainProgress: MotionValue<number>;
    holdStart: number;
    onCurtainStop?: (top: number) => void;
    onCurtainAdvance?: (top: number) => void;
}

export function useCurtainGestureGate({
    chapterRef,
    curtainProgress,
    holdStart,
    onCurtainStop,
    onCurtainAdvance
}: CurtainGestureGateOptions) {
    const phaseRef = useRef<GatePhase>('approaching');
    const heldAtRef = useRef(0);
    const advanceTimerRef = useRef(0);
    const lastWheelEventAtRef = useRef(0);
    const lastWheelDeltaRef = useRef(0);
    const secondTouchStartYRef = useRef<number | null>(null);

    const stopAtCurtain = useCallback(() => {
        const chapter = chapterRef.current;
        if (!chapter) return;

        const chapterTop = window.scrollY + chapter.getBoundingClientRect().top;
        const scrollRange = Math.max(0, chapter.offsetHeight - window.innerHeight);
        const targetTop = chapterTop + scrollRange * holdStart;

        if (onCurtainStop) onCurtainStop(targetTop);
        else window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });
    }, [chapterRef, holdStart, onCurtainStop]);

    const advanceToNextChapter = useCallback(() => {
        const chapter = chapterRef.current;
        if (!chapter) return;

        const nextChapter = chapter.nextElementSibling as HTMLElement | null;
        const targetTop = nextChapter
            ? window.scrollY + nextChapter.getBoundingClientRect().top
            : window.scrollY + chapter.getBoundingClientRect().top + chapter.offsetHeight;

        phaseRef.current = 'released';
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = 0;
        secondTouchStartYRef.current = null;

        if (onCurtainAdvance) onCurtainAdvance(targetTop);
        else window.scrollTo({ top: targetTop, left: 0, behavior: 'smooth' });
    }, [chapterRef, onCurtainAdvance]);

    useMotionValueEvent(curtainProgress, 'change', (progress) => {
        if (progress < holdStart - REARM_MARGIN) {
            phaseRef.current = 'approaching';
            heldAtRef.current = 0;
            window.clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = 0;
            secondTouchStartYRef.current = null;
            return;
        }

        if (progress >= holdStart && phaseRef.current === 'approaching') {
            phaseRef.current = 'held';
            heldAtRef.current = performance.now();
            stopAtCurtain();
        }
    });

    useEffect(() => {
        const consume = (event: Event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
        };

        const queueOrAdvance = () => {
            const thunderDuration = DO_THUNDERBOLT_ANIM ? THUNDER_DURATION_MS : 0;
            const remaining = thunderDuration - (performance.now() - heldAtRef.current);

            if (remaining <= 0) {
                advanceToNextChapter();
                return;
            }

            if (advanceTimerRef.current) return;
            advanceTimerRef.current = window.setTimeout(() => {
                advanceTimerRef.current = 0;
                if (phaseRef.current === 'held') advanceToNextChapter();
            }, remaining);
        };

        const handleWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || event.deltaY === 0) return;

            if (event.deltaY < 0) {
                if (phaseRef.current === 'held') {
                    window.clearTimeout(advanceTimerRef.current);
                    advanceTimerRef.current = 0;
                    phaseRef.current = 'released';
                }
                return;
            }

            const now = performance.now();
            const delta = Math.abs(event.deltaY);
            const beginsNewGesture = now - lastWheelEventAtRef.current > WHEEL_GESTURE_PAUSE_MS;
            const beginsWithNewImpulse =
                now - heldAtRef.current > NEW_IMPULSE_ARM_MS && delta > Math.max(14, lastWheelDeltaRef.current * 1.65);
            lastWheelEventAtRef.current = now;
            lastWheelDeltaRef.current = delta;

            if (phaseRef.current !== 'held') return;

            consume(event);

            if (beginsNewGesture || beginsWithNewImpulse) {
                queueOrAdvance();
                return;
            }

            stopAtCurtain();
        };

        const handleTouchStart = (event: TouchEvent) => {
            secondTouchStartYRef.current = phaseRef.current === 'held' ? (event.touches[0]?.clientY ?? null) : null;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (phaseRef.current !== 'held') return;

            const startY = secondTouchStartYRef.current;
            const currentY = event.touches[0]?.clientY;
            const deltaY = startY !== null && currentY !== undefined ? startY - currentY : 0;

            if (deltaY < -8) {
                phaseRef.current = 'released';
                return;
            }

            consume(event);

            if (deltaY > 8) {
                queueOrAdvance();
                return;
            }

            stopAtCurtain();
        };

        const handleTouchEnd = () => {
            secondTouchStartYRef.current = null;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!FORWARD_SCROLL_KEYS.has(event.key) || (event.key === ' ' && event.shiftKey)) return;
            if (phaseRef.current !== 'held') return;

            consume(event);

            if (!event.repeat) {
                queueOrAdvance();
                return;
            }

            stopAtCurtain();
        };

        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
        window.addEventListener('keydown', handleKeyDown, { capture: true });

        return () => {
            window.clearTimeout(advanceTimerRef.current);
            window.removeEventListener('wheel', handleWheel, true);
            window.removeEventListener('touchstart', handleTouchStart, true);
            window.removeEventListener('touchmove', handleTouchMove, true);
            window.removeEventListener('touchend', handleTouchEnd, true);
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [advanceToNextChapter, stopAtCurtain]);
}
