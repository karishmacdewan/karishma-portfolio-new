'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Bot, Braces, BrainCircuit, Gauge, Network, Route, Waypoints, Workflow, Wrench } from 'lucide-react';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import StackIcon from 'tech-stack-icons';

import { useExperience } from '@/components/providers/ExperienceProvider';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hover-card';
import {
    getTechnology,
    TECHNOLOGY_CATALOG,
    TECHNOLOGY_CATEGORIES,
    TechnologyCategory,
    TechnologyDefinition,
    TechnologyIcon as TechnologyIconDefinition
} from '@/data/technologies';

import { Reveal } from './Reveal';
import styles from './TechStack.module.scss';

const FILTER_CATEGORY_IDS = ['ai', 'front-end', 'back-end'] as const;

type FilterCategory = (typeof FILTER_CATEGORY_IDS)[number];
type ActiveCategory = FilterCategory | 'all';

const FILTER_CATEGORIES = FILTER_CATEGORY_IDS.map((id) => {
    const category = TECHNOLOGY_CATEGORIES.find((candidate) => candidate.id === id);

    if (!category) throw new Error(`Missing technology category: ${id}`);

    return { ...category, id };
});

const TOUCH_PREVIEW_COUNT = 10;

const conceptIcons: Record<Extract<TechnologyIconDefinition, { kind: 'concept' }>['name'], LucideIcon> = {
    agent: Bot,
    braces: Braces,
    brain: BrainCircuit,
    gauge: Gauge,
    graph: Network,
    route: Route,
    tool: Wrench,
    waypoints: Waypoints,
    workflow: Workflow
};

const fallbackIcon: TechnologyIconDefinition = {
    kind: 'concept',
    name: 'braces'
};

function resolveTechnologies(names?: readonly string[]) {
    if (!names) return [...TECHNOLOGY_CATALOG];

    return names.map(
        (name): TechnologyDefinition =>
            getTechnology(name) ?? {
                name,
                category: 'back-end',
                icon: fallbackIcon,
                description: 'Technology used in this project',
                link: '#'
            }
    );
}

function TechnologyIcon({ icon }: { icon: TechnologyIconDefinition }) {
    if (icon.kind === 'asset') {
        return (
            <Image
                src={icon.src}
                alt=""
                width={38}
                height={38}
                className={styles.assetIcon}
                style={icon.scale ? { transform: `scale(${icon.scale})` } : undefined}
            />
        );
    }

    if (icon.kind === 'concept') {
        const Icon = conceptIcons[icon.name];
        return <Icon aria-hidden="true" strokeWidth={1.7} />;
    }

    return (
        <StackIcon
            name={icon.name as ComponentProps<typeof StackIcon>['name']}
            className={icon.name === 'openai' ? styles.whiteStackIcon : undefined}
        />
    );
}

function isInCategory(technology: TechnologyDefinition, category: TechnologyCategory) {
    return technology.category === category || technology.additionalCategories?.includes(category);
}

function LearnMore({ technology }: { technology: TechnologyDefinition }) {
    return (
        <HoverCardContent className="w-80">
            <div>
                <h4 className="text font-semibold">{technology.name}</h4>
                <p className="text-sm">{technology.description}</p>
                {technology.link !== '#' && (
                    <a href={technology.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        Learn more
                    </a>
                )}
            </div>
        </HoverCardContent>
    );
}

function CatalogCard({ technology, enableHover }: { technology: TechnologyDefinition; enableHover: boolean }) {
    const card = (
        <motion.a
            href={technology.link}
            target={technology.link === '#' ? undefined : '_blank'}
            rel={technology.link === '#' ? undefined : 'noopener noreferrer'}
            className={styles.catalogCard}
            aria-label={`${technology.name}: ${technology.description}`}
        >
            <span className={styles.catalogIcon} data-wide={technology.icon.kind === 'asset' && technology.icon.wide}>
                <TechnologyIcon icon={technology.icon} />
            </span>
            <span className={styles.catalogName}>{technology.name}</span>
        </motion.a>
    );

    if (!enableHover) return card;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>{card}</HoverCardTrigger>
            <LearnMore technology={technology} />
        </HoverCard>
    );
}

function CategorizedTechnologyCatalog({ technologies }: { technologies: readonly TechnologyDefinition[] }) {
    const experience = useExperience();
    const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
    const [expanded, setExpanded] = useState(false);
    const enableHover = experience === 'desktop';
    const useTouchDisclosure = experience !== 'desktop';
    const primaryTechnologies = useMemo(() => technologies.filter((technology) => technology.tier !== 'secondary'), [technologies]);

    const categoryCounts = useMemo(
        () =>
            Object.fromEntries(
                FILTER_CATEGORIES.map((category) => [category.id, technologies.filter((technology) => isInCategory(technology, category.id)).length])
            ) as Record<FilterCategory, number>,
        [technologies]
    );

    useEffect(() => {
        if (activeCategory !== 'all' && categoryCounts[activeCategory] === 0) setActiveCategory('all');
    }, [activeCategory, categoryCounts]);

    useEffect(() => {
        setExpanded(false);
    }, [activeCategory]);

    const filteredTechnologies =
        activeCategory === 'all' ? primaryTechnologies : technologies.filter((technology) => isInCategory(technology, activeCategory));
    const hasHiddenTechnologies = useTouchDisclosure && filteredTechnologies.length > TOUCH_PREVIEW_COUNT;
    const visibleTechnologies = hasHiddenTechnologies && !expanded ? filteredTechnologies.slice(0, TOUCH_PREVIEW_COUNT) : filteredTechnologies;

    return (
        <div className={styles.catalog}>
            <div className={styles.filterPanel}>
                <div className={styles.filters} role="group" aria-label="Filter tools by category">
                    <button
                        type="button"
                        className={styles.filterButton}
                        data-active={activeCategory === 'all'}
                        aria-pressed={activeCategory === 'all'}
                        onClick={() => setActiveCategory('all')}
                    >
                        all <span>{primaryTechnologies.length}</span>
                    </button>
                    {FILTER_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            className={styles.filterButton}
                            data-category={category.id}
                            data-active={activeCategory === category.id}
                            aria-pressed={activeCategory === category.id}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.label} <span>{categoryCounts[category.id]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <p className="sr-only" aria-live="polite">
                {visibleTechnologies.length < filteredTechnologies.length
                    ? `Showing ${visibleTechnologies.length} of ${filteredTechnologies.length} ${activeCategory} tools`
                    : `Showing all ${filteredTechnologies.length} ${activeCategory} tools`}
            </p>

            <motion.ul layout={experience !== 'reduced'} className={styles.toolsGrid} aria-label={`${activeCategory} tools`}>
                <AnimatePresence initial={false} mode="popLayout">
                    {visibleTechnologies.map((technology) => (
                        <motion.li
                            layout={experience !== 'reduced'}
                            key={technology.name}
                            className={styles.toolItem}
                            data-category={activeCategory === 'all' ? technology.category : activeCategory}
                            data-tier={technology.tier ?? 'primary'}
                            initial={experience === 'reduced' ? false : { opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={experience === 'reduced' ? undefined : { opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.16 }}
                        >
                            <Reveal>
                                <CatalogCard technology={technology} enableHover={enableHover} />
                            </Reveal>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>

            {hasHiddenTechnologies && (
                <button type="button" className={styles.expandButton} aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
                    {expanded ? 'show less' : `expand all ${filteredTechnologies.length}`}
                </button>
            )}
        </div>
    );
}

function TechnologyChips({ technologies, enableHover }: { technologies: readonly TechnologyDefinition[]; enableHover: boolean }) {
    return (
        <ul className={styles.toolsGrid} aria-label="Technologies used">
            {technologies.map((technology, index) => (
                <li key={`${technology.name}-${index}`} className={styles.toolItem} data-category={technology.category}>
                    <CatalogCard technology={technology} enableHover={enableHover} />
                </li>
            ))}
        </ul>
    );
}

function TechnologyCards({ technologies }: { technologies: readonly TechnologyDefinition[] }) {
    return (
        <div className="mx-1 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {technologies.map((technology, index) => (
                <Reveal key={`${technology.name}-${index}`} width="100%">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <motion.a
                                href={technology.link}
                                target={technology.link === '#' ? undefined : '_blank'}
                                rel={technology.link === '#' ? undefined : 'noopener noreferrer'}
                                className="flex min-h-[48px] w-full cursor-pointer items-center justify-start rounded-lg border bg-black p-2 transition-all duration-0 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                whileHover={{
                                    backgroundColor: 'var(--brand)',
                                    color: '#ffffff'
                                }}
                                initial={{ color: '#C0C0C0' }}
                            >
                                <span className={styles.legacyIcon}>
                                    <TechnologyIcon icon={technology.icon} />
                                </span>
                                <h3 className="text-2xl font-semibold">{technology.name}</h3>
                            </motion.a>
                        </HoverCardTrigger>
                        <LearnMore technology={technology} />
                    </HoverCard>
                </Reveal>
            ))}
        </div>
    );
}

export const TechStack = ({
    technologies,
    variant = 'responsive'
}: {
    technologies?: readonly string[];
    variant?: 'responsive' | 'cards' | 'chips' | 'catalog';
} = {}) => {
    const experience = useExperience();
    const resolvedTechnologies = useMemo(() => resolveTechnologies(technologies), [technologies]);

    if (variant === 'catalog') return <CategorizedTechnologyCatalog technologies={resolvedTechnologies} />;

    const compact = variant === 'chips' || (variant === 'responsive' && experience !== 'desktop');

    return compact ? (
        <TechnologyChips technologies={resolvedTechnologies} enableHover={experience === 'desktop'} />
    ) : (
        <TechnologyCards technologies={resolvedTechnologies} />
    );
};
