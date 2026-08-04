import { useMediaQuery, useRect } from '@studio-freight/hamo';
import cn from 'clsx';
import gsap from 'gsap';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';

import { useScroll } from '@/hooks/use-scroll';
import { clamp, mapRange } from '@/lib/maths';

import s from './horizontal-slides.module.scss';

interface HorizontalSlidesProps {
    children: ReactNode;
}

export const HorizontalSlides = ({ children }: HorizontalSlidesProps) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 800px)');
    const [wrapperRectRef, wrapperRect] = useRect();
    const [elementRectRef, elementRect] = useRect();

    const { height: windowHeight } = useWindowSize();

    const [windowWidth, setWindowWidth] = useState<number>(0);

    useScroll(({ scroll }: { scroll: number }) => {
        if (!elementRect || !elementRef.current) return;

        const start = wrapperRect.top - windowHeight;
        const end = wrapperRect.top + wrapperRect.height - windowHeight;

        let progress = mapRange(start, end, scroll, 0, 1);
        progress = clamp(0, progress, 1);

        const x = progress * (elementRect.width - windowWidth);

        const cards = Array.from(elementRef.current.children) as HTMLElement[];

        gsap.to(cards, {
            x: -x,
            stagger: 0.033,
            ease: 'none',
            duration: 0
        });
    });

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(Math.min(window.innerWidth, document.documentElement.offsetWidth));
        };

        window.addEventListener('resize', onResize, false);
        onResize();

        return () => {
            window.removeEventListener('resize', onResize, false);
        };
    }, []);

    return (
        <div className={s.wrapper} ref={wrapperRectRef} style={elementRect && isMobile === false ? { height: elementRect.width + 'px' } : {}}>
            <div className={s.inner}>
                <div
                    ref={(node) => {
                        elementRef.current = node;
                        elementRectRef(node);
                    }}
                    className={cn(s.overflow, 'hide-on-mobile')}
                >
                    {children}
                </div>
                <div className={cn(s.cards, 'hide-on-desktop')}>{children}</div>
            </div>
        </div>
    );
};
