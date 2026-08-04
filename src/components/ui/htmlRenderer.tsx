import React from 'react';

interface HtmlRendererProps {
    content: string;
}
export default function HtmlRenderer({ content }: HtmlRendererProps) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
