#!/usr/bin/env node

import { access, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Primary edit controls. The recommended LinkedIn profile-banner size is 1584 × 396.
const WIDTH = 1584;
const HEIGHT = 396;
const BAR_COUNT = 141; // ~60% more than the original 88 bars.
const BAR_OVERLAP = 0.75; // Removes dark seams between adjacent bars.
const BAR_CORNER_RADIUS = 2.4; // Slight rounding without pill-shaped ends.
const TOP_OPENING = { center: 0.53, width: 0.42, exponent: 8, closedDepth: 170, openDepth: 85 };
const BOTTOM_OPENING = { center: 0.48, width: 0.42, exponent: 8, closedDepth: 170, openDepth: 120 };
const LAYER_GAP = 24; // The requested openness: separation between blue depth layers.
const SMALL_DOMAIN_SIZE = 24;
const NAME_SIZE = 82;
const TAGLINE_SIZE = 31;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = join(ROOT, 'output', 'linkedin');
const SVG_PATH = join(OUTPUT_DIR, 'linkedin-banner.svg');
const PNG_PATH = join(OUTPUT_DIR, 'linkedin-banner.png');
const SVG_ONLY = process.argv.includes('--svg-only');

const layers = [
    { layer: 3, color: '#93c5fd' },
    { layer: 2, color: '#60a5fa' },
    { layer: 1, color: '#3b82f6' },
    { layer: 0, color: '#1d4ed8' }
];

function seededFraction(index, layer) {
    const value = Math.sin((index + 1) * (layer + 3) * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

function formatNumber(value) {
    return value.toFixed(3).replace(/\.?0+$/, '');
}

function makeBarShapes(layer, top) {
    const step = WIDTH / BAR_COUNT;
    const barWidth = step + BAR_OVERLAP;
    const paths = { even: [], odd: [] };

    for (let index = 0; index < BAR_COUNT; index += 1) {
        const x = step * (index + 0.5);
        const progress = x / WIDTH;
        const layerInset = (3 - layer) * LAYER_GAP;
        const opening = top ? TOP_OPENING : BOTTOM_OPENING;
        const openAmount = Math.exp(-Math.pow(Math.abs((progress - opening.center) / opening.width), opening.exponent));
        const outerLength = opening.closedDepth - (opening.closedDepth - opening.openDepth) * openAmount;
        const baseLength = outerLength - layerInset;
        const curve = top
            ? Math.sin(progress * 5.4 + layer * 0.66) * 5 + Math.sin(progress * 13.1 + layer * 0.9) * 2.2
            : Math.sin(progress * 4.7 + 1.4 + layer * 0.78) * 5.5 + Math.sin(progress * 11.7 + 2.2 + layer) * 2.2;
        const wobble = (seededFraction(index, layer) - 0.5) * (8 + layer * 0.7);
        const length = Math.max(2, Math.min(HEIGHT + 8, baseLength + curve + wobble));
        const left = x - barWidth / 2;
        const right = x + barWidth / 2;
        const radius = Math.min(BAR_CORNER_RADIUS, length / 2);
        let shape;

        if (top) {
            shape = `M${formatNumber(left)} -8 H${formatNumber(right)} V${formatNumber(length - radius)} Q${formatNumber(right)} ${formatNumber(length)} ${formatNumber(right - radius)} ${formatNumber(length)} H${formatNumber(left + radius)} Q${formatNumber(left)} ${formatNumber(length)} ${formatNumber(left)} ${formatNumber(length - radius)} Z`;
        } else {
            const y = HEIGHT - length;
            shape = `M${formatNumber(left)} ${HEIGHT + 8} V${formatNumber(y + radius)} Q${formatNumber(left)} ${formatNumber(y)} ${formatNumber(left + radius)} ${formatNumber(y)} H${formatNumber(right - radius)} Q${formatNumber(right)} ${formatNumber(y)} ${formatNumber(right)} ${formatNumber(y + radius)} V${HEIGHT + 8} Z`;
        }

        paths[index % 2 === 0 ? 'even' : 'odd'].push(shape);
    }

    return {
        even: paths.even.join(' '),
        odd: paths.odd.join(' ')
    };
}

function makeCurtainLayer({ layer, color }) {
    const top = makeBarShapes(layer, true);
    const bottom = makeBarShapes(layer, false);

    return `
    <g>
      <path fill="${color}" d="${top.even} ${top.odd}" />
      <path fill="${color}" d="${bottom.even} ${bottom.odd}" />
    </g>`;
}

function makeSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Gaurav Dewan LinkedIn banner</title>
  <desc id="desc">A dark violet banner with four layers of thin blue curtain bars, Gaurav Dewan's name, the headline AI strategy and engineering, and a compact website lockup.</desc>
  <defs>
    <linearGradient id="stage" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07000f" />
      <stop offset="0.52" stop-color="#0c0019" />
      <stop offset="1" stop-color="#100021" />
    </linearGradient>
    <radialGradient id="blue-haze" cx="70%" cy="45%" r="54%">
      <stop offset="0" stop-color="#2563eb" stop-opacity="0.22" />
      <stop offset="0.44" stop-color="#172554" stop-opacity="0.12" />
      <stop offset="1" stop-color="#0c0019" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="name-metal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f8fafc" />
      <stop offset="0.3" stop-color="#cbd5e1" />
      <stop offset="0.49" stop-color="#ffffff" />
      <stop offset="0.72" stop-color="#bfdbfe" />
      <stop offset="1" stop-color="#f9a8d4" />
    </linearGradient>
    <linearGradient id="tagline-accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a78bfa" />
      <stop offset="0.48" stop-color="#e879f9" />
      <stop offset="1" stop-color="#f472b6" />
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#93c5fd" stroke-opacity="0.045" stroke-width="1" />
    </pattern>
    <filter id="text-glow" x="-25%" y="-60%" width="150%" height="220%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.37 0 0 0 0 0.65 0 0 0 0 0.98 0 0 0 .55 0" result="blueBlur" />
      <feMerge><feMergeNode in="blueBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="17" result="noise" />
      <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
      <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 0.065" /></feComponentTransfer>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#stage)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blue-haze)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />
  <path d="M92 0L1048 ${HEIGHT}" stroke="#60a5fa" stroke-opacity="0.07" stroke-width="1" />
  <path d="M356 0L1312 ${HEIGHT}" stroke="#f9a8d4" stroke-opacity="0.055" stroke-width="1" />

  <!-- Four solid-colour parallax layers matching the portfolio hero curtain. -->
  <g>
${layers.map(makeCurtainLayer).join('')}
  </g>

  <!-- The name appears once and doubles as the centre of the website lockup. -->
  <g transform="translate(574 0)">
    <text x="-70" y="185" fill="#93c5fd"
      font-family="'SFMono-Regular', Menlo, Consolas, monospace"
      font-size="${SMALL_DOMAIN_SIZE}" font-weight="600" letter-spacing="1.3">www.</text>
    <text x="0" y="187" fill="url(#name-metal)" filter="url(#text-glow)"
      font-family="'Space Grotesk', 'Avenir Next', 'Helvetica Neue', Arial, sans-serif"
      font-size="${NAME_SIZE}" font-weight="700" letter-spacing="-4.7">gaurav dewan</text>
    <text x="535" y="185" fill="#f9a8d4"
      font-family="'SFMono-Regular', Menlo, Consolas, monospace"
      font-size="${SMALL_DOMAIN_SIZE}" font-weight="600" letter-spacing="1.3">.co.uk</text>
    <text x="-30" y="249" fill="url(#tagline-accent)"
      font-family="'SFMono-Regular', Menlo, Consolas, monospace"
      font-size="${TAGLINE_SIZE}" font-weight="600" letter-spacing="3.1"
      stroke="#0c0019" stroke-width="2.4" stroke-opacity="0.84" paint-order="stroke fill">ai strategy and engineering</text>
  </g>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fff" filter="url(#grain)" opacity="0.5" pointer-events="none" />
</svg>
`;
}

async function canAccess(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function findChrome() {
    const absoluteCandidates = [
        process.env.CHROME_BIN,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium'
    ].filter(Boolean);

    for (const candidate of absoluteCandidates) {
        if (await canAccess(candidate)) return candidate;
    }

    for (const command of ['google-chrome', 'chromium', 'chromium-browser', 'chrome']) {
        const result = spawnSync('which', [command], { encoding: 'utf8' });
        if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
    }

    return null;
}

async function waitForExit(child, timeoutMs) {
    if (child.exitCode !== null) return;

    await new Promise((resolveExit) => {
        const timer = setTimeout(resolveExit, timeoutMs);
        child.once('exit', () => {
            clearTimeout(timer);
            resolveExit();
        });
    });
}

async function renderPng() {
    const chrome = await findChrome();
    if (!chrome) {
        throw new Error('Chrome/Chromium was not found. Run with --svg-only, or set CHROME_BIN to a browser executable.');
    }

    const profileDir = join(OUTPUT_DIR, `.banner-chrome-${process.pid}`);
    const args = [
        '--headless=new',
        '--no-first-run',
        '--disable-background-networking',
        '--disable-extensions',
        '--hide-scrollbars',
        '--disable-gpu',
        '--force-device-scale-factor=1',
        `--window-size=${WIDTH},${HEIGHT}`,
        `--user-data-dir=${profileDir}`,
        `--screenshot=${PNG_PATH}`,
        pathToFileURL(SVG_PATH).href
    ];

    await rm(PNG_PATH, { force: true });
    const child = spawn(chrome, args, {
        detached: process.platform !== 'win32',
        stdio: 'ignore'
    });
    let spawnError;
    child.once('error', (error) => {
        spawnError = error;
    });

    const startedAt = Date.now();
    let previousSize = -1;
    let stableChecks = 0;

    while (Date.now() - startedAt < 15_000) {
        if (spawnError) break;

        try {
            const file = await stat(PNG_PATH);
            stableChecks = file.size > 10_000 && file.size === previousSize ? stableChecks + 1 : 0;
            previousSize = file.size;
            if (stableChecks >= 2) break;
        } catch {
            // The screenshot is not ready yet.
        }

        await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
    }

    if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    } else {
        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch {
            // Chrome may already have exited by itself.
        }
    }

    await waitForExit(child, 1_000);
    if (child.exitCode === null && process.platform !== 'win32') {
        try {
            process.kill(-child.pid, 'SIGKILL');
        } catch {
            // The process group has already stopped.
        }
        await waitForExit(child, 500);
    }

    await rm(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });

    if (spawnError) throw spawnError;
    if (stableChecks < 2) throw new Error('Chrome did not finish the PNG render within 15 seconds.');
}

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(SVG_PATH, makeSvg(), 'utf8');
console.log(`Generated ${SVG_PATH}`);

if (!SVG_ONLY) {
    await renderPng();
    console.log(`Generated ${PNG_PATH}`);
}
