import type { Project } from '@/components/ui/projects/types';
import { getTechnologyCategories } from '@/data/technologies';

const experienceWarning = 'Selected experience logo only. Project details are not shown.';

const companyExperience = [
    ['Google', '/client-logos/google-card.png', 'google'],
    ['Amazon', '/client-logos/amazon-card.png', 'amazon'],
    ['Deutsche Bank', '/client-logos/deutsche-bank-primary-blue.png', 'deutsche-bank'],
    ['Liberty', '/client-logos/liberty-card.png', 'liberty'],
    ['Mesha', '/client-logos/mesha-card.png', 'mesha'],
    ['Samsung', '/client-logos/samsung-card.png', 'samsung'],
    ['Huawei', '/client-logos/huawei-card.png', 'huawei'],
    ['Honor', '/client-logos/honor-card-v2.png', 'honor'],
    ['Mercedes-Benz Group', '/client-logos/mercedes-benz-group-card-v2.png', 'mercedes-benz-group'],
    ['VW Group', '/client-logos/vw-group-card-v2.png', 'vw-group'],
    ['BMW', '/client-logos/bmw-card.png', 'bmw'],
    ['Toyota', '/client-logos/toyota-card.png', 'toyota'],
    ['GM', '/client-logos/general-motors-card.png', 'general-motors'],
    ['Careem', '/client-logos/careem-card.png', 'careem'],
    ['Universal', '/client-logos/universal-card.png', 'universal'],
    ['Warner Bros.', '/client-logos/warner-bros-card.png', 'warner-bros'],
    ['Netflix', '/client-logos/netflix-card.png', 'netflix'],
    ['Disney', '/client-logos/disney-card.png', 'disney'],
    ['Sony', '/client-logos/sony-card.png', 'sony'],
    ['BBC', '/client-logos/bbc-card.png', 'bbc']
] as const;

const projectData = companyExperience.map(([name, logo, brand]) => ({
    title: name,
    link: '',
    thumbnail: [logo],
    headline: `Selected experience with ${name}.`,
    description: experienceWarning,
    technologies: [],
    githubLink: null,
    projectLink: null,
    warning: experienceWarning,
    client: {
        name,
        logo,
        brand
    },
    cardArtwork: 'client-logo'
})) satisfies Omit<Project, 'categories'>[];

export const projects = projectData.map((project) => ({
    ...project,
    categories: getTechnologyCategories(project.technologies)
})) satisfies Project[];
