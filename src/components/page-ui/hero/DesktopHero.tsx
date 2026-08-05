"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Rellax from "rellax";

import { useSettledViewportEffect } from "@/hooks/use-settled-viewport-effect";
import { instrumentSerifRegular } from "@/lib/fonts";

import { DO_THUNDERBOLT_ANIM } from "./config";
import { HERO_TAGLINE } from "./copy";
import { CurtainLightning } from "./CurtainLightning";
import styles from "./hero.module.scss";
import { HeroMessage } from "./HeroMessage";
import { Hold } from "./Hold";
import { useCurtainGestureGate } from "./use-curtain-gesture-gate";
import { useHeroThemeScrollState } from "./use-hero-theme-scroll-state";

const BAR_COUNT = 90;
// Keeps the completed curtain open for roughly the last fifth of the pinned scroll.
const CURTAIN_HOLD_START = 0.81;

const layers = [
  {
    minSpeed: 2,
    maxSpeed: 3,
    zIndex: 0,
    extraHeight: 0,
  },
  {
    minSpeed: 4,
    maxSpeed: 6,
    zIndex: 20,
    extraHeight: 0,
  },
  {
    minSpeed: 7,
    maxSpeed: 9,
    zIndex: 20,
    extraHeight: 0,
  },
  {
    minSpeed: 10,
    maxSpeed: 12,
    zIndex: 20,
    extraHeight: 2,
  },
] as const;

function seededFraction(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

interface BarsLayerProps {
  layerIndex: number;
  minSpeed: number;
  maxSpeed: number;
  zIndex: number;
  extraHeight: number;
}

function ScrollCue({
  label,
  secondary = false,
}: {
  label: string;
  secondary?: boolean;
}) {
  return (
    <div className={secondary ? styles.desktopScroll : styles.desktopPrompt}>
      <span>{label}</span>
      <ArrowDown className={styles.scrollCueArrow} aria-hidden="true" />
    </div>
  );
}

function BarsLayer({
  layerIndex,
  minSpeed,
  maxSpeed,
  zIndex,
  extraHeight,
}: BarsLayerProps) {
  const bars = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, index) => {
        const progress = index / (BAR_COUNT - 1);
        const speed =
          minSpeed +
          seededFraction(layerIndex * 1000 + index + 1) * (maxSpeed - minSpeed);

        return {
          height: progress * 100 + extraHeight,
          speed,
        };
      }),
    [extraHeight, layerIndex, maxSpeed, minSpeed],
  );

  return (
    <div
      className={styles.layer}
      data-layer={layerIndex + 1}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <div className={`${styles.barTrack} ${styles.topTrack}`}>
        {bars.map((bar, index) => (
          <span
            key={index}
            className={`${styles.bar} desktop-rellax`}
            style={{ height: `calc(${bar.height}% + 2px)` }}
            data-rellax-speed={bar.speed}
          />
        ))}
      </div>
      <div className={`${styles.barTrack} ${styles.bottomTrack}`}>
        {[...bars].reverse().map((bar, index) => (
          <span
            key={index}
            className={`${styles.bar} desktop-rellax`}
            style={{ height: `calc(${bar.height}% + 2px)` }}
            data-rellax-speed={-bar.speed}
          />
        ))}
      </div>
    </div>
  );
}

export function DesktopHero({
  onReady,
  onCurtainStop,
  onCurtainAdvance,
}: {
  onReady?: () => void;
  onCurtainStop?: (top: number) => void;
  onCurtainAdvance?: (top: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const barsChapterRef = useRef<HTMLDivElement>(null);
  const rellaxRef = useRef<Rellax | null>(null);
  const curtainHeldRef = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCurtainHeld, setIsCurtainHeld] = useState(false);
  const isThemeScrolling = useHeroThemeScrollState();
  const { scrollYProgress: curtainProgress } = useScroll({
    target: barsChapterRef,
    offset: ["start start", "end end"],
  });

  useCurtainGestureGate({
    chapterRef: barsChapterRef,
    curtainProgress,
    holdStart: CURTAIN_HOLD_START,
    onCurtainStop,
    onCurtainAdvance,
  });

  const updateCurtainHold = useCallback((shouldHold: boolean) => {
    if (shouldHold === curtainHeldRef.current) return;
    if (shouldHold && !rellaxRef.current) return;

    if (shouldHold) {
      barsChapterRef.current
        ?.querySelectorAll<HTMLElement>(`.${styles.bar}`)
        .forEach((bar) => {
          bar.style.setProperty(
            "--curtain-held-transform",
            window.getComputedStyle(bar).transform,
          );
        });
    }

    curtainHeldRef.current = shouldHold;
    setIsCurtainHeld(shouldHold);
  }, []);

  useMotionValueEvent(curtainProgress, "change", (progress) => {
    updateCurtainHold(progress >= CURTAIN_HOLD_START);
  });

  useSettledViewportEffect(() => {
    rellaxRef.current?.refresh();
  });

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const rellax = new Rellax("[data-desktop-hero] .desktop-rellax", {
      breakpoints: [640, 768, 1024],
    });
    rellaxRef.current = rellax;
    const frame = window.requestAnimationFrame(() => {
      rellax.refresh();
      updateCurtainHold(curtainProgress.get() >= CURTAIN_HOLD_START);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      rellax.destroy();
      if (rellaxRef.current === rellax) rellaxRef.current = null;
    };
  }, [curtainProgress, updateCurtainHold]);

  useEffect(() => {
    const updateStartedState = () => {
      const sectionTop = sectionRef.current?.offsetTop ?? 0;
      setHasStarted(window.scrollY > sectionTop + 16);
    };

    updateStartedState();
    window.addEventListener("scroll", updateStartedState, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", updateStartedState);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.desktopHero}
      data-desktop-hero
      data-started={hasStarted}
      data-curtain-held={isCurtainHeld}
      data-thunderbolt-anim={DO_THUNDERBOLT_ANIM}
      data-theme-scrolling={isThemeScrolling}
    >
      <div ref={barsChapterRef} className={styles.desktopBarsChapter}>
        <div className={styles.desktopScene}>
          <div className={styles.desktopCopy}>
            <h1
              className={`${instrumentSerifRegular.className} ${styles.identitySubheading}`}
              aria-label={HERO_TAGLINE}
            >
              Strategy, <em>taste</em> &amp; code
              <span className={styles.heroAccent}>.</span>
            </h1>
            <p className={styles.heroSupportLine}>
              <span className={styles.heroSubtitleLine}>
                Most AI is built through only one lens. I build across all three
                —
              </span>
              <span className={styles.heroSubtitleLine}>
                for companies that care how AI feels, not just what it does.
              </span>
            </p>
          </div>
          <div className={styles.heroScreenDetails} aria-hidden="true">
            <p className={styles.heroScreenLeft}>
              Strategic Partnerships &amp; AI Transformation Lead
            </p>
            <p className={styles.heroScreenRight}>
              Selected advisory, transformation and interim engagements
            </p>
          </div>

          <div className={styles.desktopStageCue}>
            <ScrollCue label="keep scrolling" secondary />
          </div>

          {!hasStarted && <ScrollCue label="start scrolling" />}

          {layers.map((layer, index) => (
            <BarsLayer key={index} layerIndex={index} {...layer} />
          ))}

          {DO_THUNDERBOLT_ANIM && <CurtainLightning />}
        </div>
        <Hold chapter="curtain" />
      </div>
      <HeroMessage variant="desktop" />
    </section>
  );
}
