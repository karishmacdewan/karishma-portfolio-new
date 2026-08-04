'use client';

import Lenis from 'lenis';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// import { About } from '@/components/page-ui/about/About';
import { Contact } from '@/components/page-ui/contact/Contact';
import { DesktopPreferenceHint } from '@/components/page-ui/DesktopPreferenceHint';
// import { Experience } from '@/components/page-ui/experience/Experience';
// import { CompanyMarquee } from '@/components/page-ui/intro/CompanyMarquee';
import { IntroChapter } from '@/components/page-ui/intro/IntroChapter';
import { LandingPage } from '@/components/page-ui/LandingPage';
import { PortfolioHeader } from '@/components/page-ui/PortfolioHeader';
import { ProjectsSection } from '@/components/page-ui/ProjectsSection';
import { ExperienceLoading } from '@/components/providers/ExperienceLoading';
import { ExperienceProvider, useExperienceState } from '@/components/providers/ExperienceProvider';
// import { MobileNav } from '@/components/ui/nav/MobileNav';
// import { SideBar } from '@/components/ui/nav/SideBar';
import { useSettledViewportEffect } from '@/hooks/use-settled-viewport-effect';

const LOADER_MIN_VISIBLE_MS = 1500;
const LOADER_MAX_VISIBLE_MS = 2000;
const LOADER_EXIT_MS = 960;
const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp']);

type LoaderPhase = 'visible' | 'exiting' | 'hidden';

export default function Home() {
    return (
        <ExperienceProvider>
            <PortfolioHome />
        </ExperienceProvider>
    );
}

function PortfolioHome() {
    const { mode: detectedExperience } = useExperienceState();
    const experience = detectedExperience ?? 'touch';
    const lenisRef = useRef<Lenis | null>(null);
    const loaderStartedAtRef = useRef(Date.now());
    const [loaderPhase, setLoaderPhase] = useState<LoaderPhase>('visible');
    const [readyExperience, setReadyExperience] = useState<typeof detectedExperience>(null);
    const experienceReady = Boolean(detectedExperience && readyExperience === detectedExperience);
    const loaderActive = loaderPhase !== 'hidden';

    const handleExperienceReady = useCallback(() => {
        if (detectedExperience) setReadyExperience(detectedExperience);
    }, [detectedExperience]);

    const handleChapterScroll = useCallback((top: number, durationMs: number) => {
        const lenis = lenisRef.current;
        if (lenis) {
            lenis.scrollTo(top, { duration: durationMs / 1000, force: true, lock: true });
            return;
        }

        window.scrollTo({ top, behavior: 'smooth' });
    }, []);

    const handleCurtainStop = useCallback((top: number) => {
        const lenis = lenisRef.current;
        if (lenis) {
            lenis.scrollTo(top, { immediate: true, force: true });
            return;
        }

        window.scrollTo({ top, left: 0, behavior: 'auto' });
    }, []);

    const handleCurtainAdvance = useCallback(
        (top: number) => {
            handleChapterScroll(top, 680);
        },
        [handleChapterScroll]
    );

    useLayoutEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        const frame = window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });

        return () => {
            window.cancelAnimationFrame(frame);
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    useEffect(() => {
        if (loaderPhase !== 'visible') return;

        const elapsed = Date.now() - loaderStartedAtRef.current;
        const timeout = window.setTimeout(() => setLoaderPhase('exiting'), Math.max(0, LOADER_MAX_VISIBLE_MS - elapsed));

        return () => window.clearTimeout(timeout);
    }, [loaderPhase]);

    useEffect(() => {
        if (!experienceReady || loaderPhase !== 'visible') return;

        const elapsed = Date.now() - loaderStartedAtRef.current;
        const timeout = window.setTimeout(() => setLoaderPhase('exiting'), Math.max(0, LOADER_MIN_VISIBLE_MS - elapsed));

        return () => window.clearTimeout(timeout);
    }, [experienceReady, loaderPhase]);

    useEffect(() => {
        if (loaderPhase !== 'exiting') return;

        const fallback = window.setTimeout(() => setLoaderPhase('hidden'), LOADER_EXIT_MS + 200);

        return () => window.clearTimeout(fallback);
    }, [loaderPhase]);

    useLayoutEffect(() => {
        if (!loaderActive) return;

        const root = document.documentElement;
        const previousRootOverflow = root.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;
        const previousOverscrollBehavior = root.style.overscrollBehavior;
        const preventScroll = (event: Event) => event.preventDefault();
        const preventScrollKeys = (event: KeyboardEvent) => {
            if (SCROLL_KEYS.has(event.key)) event.preventDefault();
        };

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        root.style.overflow = 'hidden';
        root.style.overscrollBehavior = 'none';
        document.body.style.overflow = 'hidden';
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('keydown', preventScrollKeys);

        return () => {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', preventScrollKeys);
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            root.style.overflow = previousRootOverflow;
            root.style.overscrollBehavior = previousOverscrollBehavior;
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [loaderActive]);

    useLayoutEffect(() => {
        if (detectedExperience !== 'desktop' || loaderActive) return;

        const lenis = new Lenis();
        lenisRef.current = lenis;
        let animationFrame = 0;

        const raf = (time: number) => {
            lenis.raf(time);
            animationFrame = window.requestAnimationFrame(raf);
        };

        animationFrame = window.requestAnimationFrame(raf);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            lenis.destroy();
            if (lenisRef.current === lenis) lenisRef.current = null;
        };
    }, [detectedExperience, loaderActive]);

    useSettledViewportEffect(
        () => {
            const lenis = lenisRef.current;
            if (!lenis) return;

            lenis.resize();
            lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        },
        detectedExperience === 'desktop' && !loaderActive
    );

    return (
        <>
            <div className="portfolio-shell" data-experience={experience}>
                {/* {experience === 'desktop' ? <SideBar /> : <MobileNav />} */}
                <PortfolioHeader />
                <main id="main" className="portfolio-main">
                    <LandingPage onReady={handleExperienceReady} onCurtainStop={handleCurtainStop} onCurtainAdvance={handleCurtainAdvance} />
                    <ProjectsSection />
                    <IntroChapter onScrollTo={handleChapterScroll} />
                    {/* <About /> */}
                    {/* <Experience /> */}
                    <Contact />
                </main>
            </div>
            {/* <CompanyMarquee /> */}
            {detectedExperience && detectedExperience !== 'desktop' && <DesktopPreferenceHint />}
            {loaderPhase !== 'hidden' && <ExperienceLoading exiting={loaderPhase === 'exiting'} onExitComplete={() => setLoaderPhase('hidden')} />}
        </>
    );
}
