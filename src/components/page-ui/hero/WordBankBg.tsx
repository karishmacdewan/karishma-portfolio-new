'use client';

import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { CSSProperties } from 'react';

import wordBankData from '@/data/hero-word-bank.json';
import { TECHNOLOGY_CATALOG } from '@/data/technologies';

import styles from './word-bank-bg.module.scss';

type WordGroup = 'strategy' | 'ai' | 'platform';
type WordWeight = 1 | 2 | 3;

interface WordBankEntry {
    label: string;
    group: WordGroup;
    weight: WordWeight;
}

type WordStyle = CSSProperties & {
    '--word-x': string;
    '--word-y': string;
    '--word-rotation': string;
    '--word-scale': number;
    '--word-opacity': number;
};

const LAYER_COUNT = 3;
const RESERVED_FOREGROUND_WORDS = new Set(['strategy', 'interface', 'intelligence', 'infra', 'infrastructure']);

function hashWord(value: string) {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function normaliseEntries() {
    const configuredEntries = wordBankData.terms as WordBankEntry[];
    const featuredTools = new Set(wordBankData.featuredTools);
    const technologyEntries: WordBankEntry[] = wordBankData.includeTechnologyCatalog
        ? TECHNOLOGY_CATALOG.map((technology) => ({
              label: technology.name,
              group: technology.category === 'ai' ? 'ai' : 'platform',
              weight: featuredTools.has(technology.name) ? 2 : 1
          }))
        : [];
    const seen = new Set<string>();

    return [...configuredEntries, ...technologyEntries]
        .filter((entry) => {
            const key = entry.label.trim().toLocaleLowerCase();
            if (!key || seen.has(key) || RESERVED_FOREGROUND_WORDS.has(key)) return false;
            seen.add(key);
            return true;
        })
        .sort((left, right) => hashWord(left.label) - hashWord(right.label));
}

const WORD_LAYERS = normaliseEntries().reduce<WordBankEntry[][]>(
    (layers, entry, index) => {
        layers[index % LAYER_COUNT].push(entry);
        return layers;
    },
    Array.from({ length: LAYER_COUNT }, () => [])
);

function getWordStyle(entry: WordBankEntry, index: number, layerIndex: number, layerLength: number): WordStyle {
    const hash = hashWord(`${entry.label}-${layerIndex}`);
    const columns = layerIndex === 1 ? 7 : 8;
    const rows = Math.ceil(layerLength / columns);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const jitterX = ((hash & 0xff) / 255 - 0.5) * 7;
    const jitterY = (((hash >> 8) & 0xff) / 255 - 0.5) * 9;
    const x = Math.max(2, Math.min(98, ((column + 0.5) / columns) * 100 + jitterX));
    const y = Math.max(3, Math.min(97, ((row + 0.5) / rows) * 100 + jitterY));
    const rotation = (((hash >> 16) & 0xff) / 255 - 0.5) * 10;
    const scale = 0.88 + (((hash >> 24) & 0xff) / 255) * 0.24;
    const opacity = 0.13 + entry.weight * 0.03 + ((hash & 0x0f) / 15) * 0.03;

    return {
        '--word-x': `${x}%`,
        '--word-y': `${y}%`,
        '--word-rotation': `${rotation}deg`,
        '--word-scale': Number(scale.toFixed(3)),
        '--word-opacity': Number(opacity.toFixed(3))
    };
}

function WordLayer({
    entries,
    layerIndex,
    entranceProgress,
    chapterProgress,
    reducedMotion
}: {
    entries: WordBankEntry[];
    layerIndex: number;
    entranceProgress: MotionValue<number>;
    chapterProgress: MotionValue<number>;
    reducedMotion: boolean;
}) {
    const start = layerIndex * 0.035;
    const overshoot = start + 0.08;
    const settle = start + 0.15;
    const exitStart = 0.95 + layerIndex * 0.006;
    const exitEnd = 0.985 + layerIndex * 0.005;
    const exitDirection = layerIndex % 2 === 0 ? -1 : 1;
    const opacity = useTransform(entranceProgress, [start, overshoot, settle], [0, 0.82, 1]);
    const x = useTransform(entranceProgress, [start, overshoot, settle], [layerIndex % 2 === 0 ? -18 : 18, 3, 0]);
    const y = useTransform(entranceProgress, [start, overshoot, settle], [34 + layerIndex * 8, -6, 0]);
    const scale = useTransform(entranceProgress, [start, overshoot, settle], [0.93, 1.025, 1]);
    const exitOpacity = useTransform(chapterProgress, [exitStart, exitEnd], [1, 0]);
    const exitX = useTransform(chapterProgress, [exitStart, exitEnd], [0, exitDirection * 24]);
    const exitY = useTransform(chapterProgress, [exitStart, exitEnd], [0, -64]);
    const exitScale = useTransform(chapterProgress, [exitStart, exitEnd], [1, 0.95]);

    return (
        <motion.div className={styles.wordLayerEntrance} style={reducedMotion ? undefined : { opacity, x, y, scale }}>
            <motion.div
                className={styles.wordLayerExit}
                style={reducedMotion ? undefined : { opacity: exitOpacity, x: exitX, y: exitY, scale: exitScale }}
            >
                <div className={styles.wordLayer} data-layer={layerIndex}>
                    {entries.map((entry, index) => (
                        <span
                            key={entry.label}
                            className={styles.word}
                            data-group={entry.group}
                            data-weight={entry.weight}
                            style={getWordStyle(entry, index, layerIndex, entries.length)}
                        >
                            {entry.label}
                        </span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function WordBankBg({
    entranceProgress,
    chapterProgress,
    reducedMotion = false
}: {
    entranceProgress: MotionValue<number>;
    chapterProgress: MotionValue<number>;
    reducedMotion?: boolean;
}) {
    return (
        <div className={styles.wordBankBg} data-reduced-motion={reducedMotion} aria-hidden="true">
            {WORD_LAYERS.map((layer, layerIndex) => (
                <WordLayer
                    key={layerIndex}
                    entries={layer}
                    layerIndex={layerIndex}
                    entranceProgress={entranceProgress}
                    chapterProgress={chapterProgress}
                    reducedMotion={reducedMotion}
                />
            ))}
        </div>
    );
}
