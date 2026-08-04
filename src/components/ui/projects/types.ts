import type { TechnologyCategory } from '@/data/technologies';

export interface Project {
    title: string;
    headline: string;
    link: string;
    thumbnail: string[];
    technologies: string[];
    categories: TechnologyCategory[];
    description: string[] | string;
    githubLink: string | null;
    projectLink: string | null;
    warning: string | null;
    redacted?: boolean;
    timeline?:
        | string
        | {
              start: string;
              end: string;
          };
    client?: {
        name: string;
        logo: string;
        brand?: string;
    };
    cardArtwork?: 'project' | 'client-logo';
    artworkFit?: 'cover' | 'contain';
    containedThumbnails?: string[];
    desktopCoverThumbnails?: string[];
    artworkBackground?: string;
    thumbnailBackgrounds?: Partial<Record<string, string>>;
    artworkScale?: number;
    thumbnailScales?: Partial<Record<string, number>>;
}
