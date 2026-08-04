import Image from 'next/image';
import Link from 'next/link';

import HtmlRenderer from '@/components/ui/htmlRenderer';

// deprecated: tried to take from https://www.otha.works/ but couldn't get the animation

interface ProjectItem {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    featuredImage: string | undefined;
    terms: string[];
}

interface ProjectCardProps {
    project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const placeholderImageSrc = project.featuredImage ? project.featuredImage : '/placeholder-image.jpeg';
    return (
        <div className="grid-item column undefined has-animated project-card">
            <Link href={`#${project.slug}`} className="thumb space-2 lightbox" data-index="2">
                <Image alt="image" src={placeholderImageSrc} width={1000} height={1000} />
                <div className="labels">
                    {project.terms.map((item, index) => (
                        <span key={item}>
                            {item}
                            {project.terms.length !== index + 1 && ', '}
                        </span>
                    ))}
                </div>
                <div className="caption">
                    <div className="title">{project.title}</div>
                    <div className="sub">
                        <HtmlRenderer content={project.excerpt} />
                    </div>
                </div>
            </Link>
        </div>
    );
};
