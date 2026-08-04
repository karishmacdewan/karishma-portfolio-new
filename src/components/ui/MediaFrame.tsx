import Image from 'next/image';
import type { CSSProperties } from 'react';

export function MediaFrame({
    src,
    height,
    width,
    className,
    style,
    alt
}: {
    src: string | string[];
    height: string;
    width: string;
    className: string;
    style?: CSSProperties;
    alt: string;
}) {
    const mediaSource = Array.isArray(src) ? src[0] : src;
    const isVideo = mediaSource.toLowerCase().endsWith('.mp4');

    if (isVideo) {
        return <video autoPlay loop muted playsInline className={className} style={style} src={mediaSource} aria-label={alt || undefined} />;
    }

    return (
        <Image
            src={mediaSource}
            height={Number.parseInt(height, 10)}
            width={Number.parseInt(width, 10)}
            className={className}
            style={style}
            alt={alt}
            sizes="(max-width: 700px) 84vw, (max-width: 1279px) 58vw, 30vw"
        />
    );
}
