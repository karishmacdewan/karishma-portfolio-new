import React, { ReactNode } from 'react';

interface AnimatedSlideProps {
    children: ReactNode;
}

export const AnimatedSlide: React.FC<AnimatedSlideProps> = ({ children }) => {
    return (
        <div className="pointer-events-none sticky top-0 h-screen" style={{ backgroundColor: 'black' }}>
            {children}
        </div>
    );
};
