import styles from './hero.module.scss';

const BOLT_POINTS = [
    [-28, -18],
    [52, 42],
    [104, 82],
    [158, 98],
    [204, 154],
    [260, 174],
    [305, 235],
    [363, 252],
    [410, 307],
    [462, 322],
    [505, 366],
    [548, 376],
    [582, 354],
    [614, 400],
    [655, 412],
    [696, 458],
    [742, 473],
    [784, 526],
    [835, 542],
    [879, 594],
    [932, 618],
    [983, 670],
    [1040, 690],
    [1230, 816]
] as const;

const BOLT_PATH = BOLT_POINTS.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ');

function createTaperedBolt(startWidth: number, endWidth: number) {
    const left: string[] = [];
    const right: string[] = [];

    BOLT_POINTS.forEach(([x, y], index) => {
        const previous = BOLT_POINTS[Math.max(0, index - 1)];
        const next = BOLT_POINTS[Math.min(BOLT_POINTS.length - 1, index + 1)];
        const dx = next[0] - previous[0];
        const dy = next[1] - previous[1];
        const length = Math.hypot(dx, dy) || 1;
        const progress = index / (BOLT_POINTS.length - 1);
        const halfWidth = (startWidth + (endWidth - startWidth) * progress) / 2;
        const offsetX = (-dy / length) * halfWidth;
        const offsetY = (dx / length) * halfWidth;

        left.push(`${x + offsetX},${y + offsetY}`);
        right.unshift(`${x - offsetX},${y - offsetY}`);
    });

    return [...left, ...right].join(' ');
}

const DESKTOP_TAPERED_BOLT = createTaperedBolt(16, 0.6);
const MOBILE_TAPERED_BOLT = createTaperedBolt(32, 0.6);

const BRANCHES = [
    'M104 82 L93 55 L71 40',
    'M204 154 L174 160 L154 180',
    'M305 235 L292 205 L270 193',
    'M410 307 L380 319 L360 343',
    'M505 366 L491 337 L468 320',
    'M582 354 L598 327 L605 301',
    'M655 412 L676 395 L685 370',
    'M742 473 L723 500 L699 512',
    'M835 542 L856 526 L868 500',
    'M932 618 L916 643 L891 654',
    'M1040 690 L1060 675 L1074 652'
] as const;

const PARTICLES = [
    { cx: 88, cy: 73, r: 1.15 },
    { cx: 188, cy: 132, r: 0.7 },
    { cx: 286, cy: 218, r: 0.9 },
    { cx: 392, cy: 286, r: 0.55 },
    { cx: 520, cy: 392, r: 0.8 },
    { cx: 638, cy: 436, r: 0.55 },
    { cx: 718, cy: 486, r: 0.75 },
    { cx: 852, cy: 574, r: 0.55 },
    { cx: 954, cy: 648, r: 0.4 }
] as const;

export function CurtainLightning({ mobile = false }: { mobile?: boolean }) {
    const taperedBolt = mobile ? MOBILE_TAPERED_BOLT : DESKTOP_TAPERED_BOLT;

    return (
        <div className={styles.curtainLightning} aria-hidden="true">
            <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="curtain-lightning-silver" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#fff" />
                        <stop offset="0.2" stopColor="#d8dee8" />
                        <stop offset="0.48" stopColor="#f8fafc" />
                        <stop offset="0.76" stopColor="#b8c1ce" />
                        <stop offset="1" stopColor="#fff" />
                    </linearGradient>
                    <radialGradient id="curtain-lightning-flare">
                        <stop offset="0" stopColor="#fff" />
                        <stop offset="0.24" stopColor="#e2e8f0" stopOpacity="0.72" />
                        <stop offset="1" stopColor="#94a3b8" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <g className={styles.lightningBolt}>
                    <polygon className={styles.lightningAura} points={taperedBolt} />
                    <polygon className={styles.lightningBody} points={taperedBolt} fill="url(#curtain-lightning-silver)" />
                </g>

                <path className={styles.lightningCore} d={BOLT_PATH} />

                <g className={styles.lightningBranches}>
                    {BRANCHES.map((branch) => (
                        <path key={branch} className={styles.lightningBranch} d={branch} />
                    ))}
                </g>

                <ellipse className={styles.lightningFlare} cx="582" cy="354" rx="22" ry="22" fill="url(#curtain-lightning-flare)" />

                <g className={styles.lightningSnow}>
                    {PARTICLES.map((particle, index) => (
                        <circle key={`${particle.cx}-${particle.cy}`} {...particle} style={{ animationDelay: `${90 + index * 48}ms` }} />
                    ))}
                </g>
            </svg>
        </div>
    );
}
