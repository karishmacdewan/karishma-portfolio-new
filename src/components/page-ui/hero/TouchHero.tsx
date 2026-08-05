"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

import { instrumentSerifRegular } from "@/lib/fonts";

import { HERO_TAGLINE } from "./copy";
import styles from "./hero.module.scss";
import { HeroMessage } from "./HeroMessage";
import { useHeroThemeScrollState } from "./use-hero-theme-scroll-state";

export function TouchHero({
  reducedMotion = false,
  onReady,
}: {
  reducedMotion?: boolean;
  onReady?: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const systemPrefersReducedMotion = useReducedMotion();
  const shouldReduceMotion =
    reducedMotion || Boolean(systemPrefersReducedMotion);
  const isThemeScrolling = useHeroThemeScrollState();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const fieldRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const identityY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const promptOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [1, 0.65, 0],
  );

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const wordAnimation = (x: number, y: number, delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="home"
      className={styles.touchHero}
      data-reduced-motion={shouldReduceMotion}
      data-theme-scrolling={isThemeScrolling}
    >
      <div ref={sectionRef} className={styles.touchIdentityChapter}>
        <div className={styles.touchScene}>
          <motion.div
            className={styles.typeField}
            style={
              shouldReduceMotion
                ? undefined
                : { rotate: fieldRotate, scale: fieldScale }
            }
            aria-hidden="true"
          >
            <motion.span
              className={styles.fullStack}
              {...wordAnimation(-80, 0, 0.05)}
            >
              strategy
            </motion.span>
            <motion.span
              className={styles.ai}
              {...wordAnimation(64, -32, 0.15)}
            >
              taste
            </motion.span>
            <motion.span
              className={styles.engineer}
              {...wordAnimation(0, 72, 0.25)}
            >
              code
            </motion.span>
          </motion.div>

          <motion.div
            className={styles.touchCopy}
            style={shouldReduceMotion ? undefined : { y: identityY }}
          >
            <h1
              className={`${instrumentSerifRegular.className} ${styles.identitySubheading} ${styles.mobileIdentitySubheading}`}
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
          </motion.div>
          <div className={styles.heroScreenDetails} aria-hidden="true">
            <p className={styles.heroScreenLeft}>
              Strategic Partnerships &amp; AI Transformation Lead
            </p>
            <p className={styles.heroScreenRight}>
              Selected advisory, transformation and interim engagements
            </p>
          </div>

          <motion.div
            className={styles.touchPrompt}
            style={shouldReduceMotion ? undefined : { opacity: promptOpacity }}
          >
            <span>scroll to explore</span>
            <ArrowDown aria-hidden="true" />
          </motion.div>
        </div>
      </div>
      <HeroMessage variant="touch" reducedMotion={shouldReduceMotion} />
    </section>
  );
}
