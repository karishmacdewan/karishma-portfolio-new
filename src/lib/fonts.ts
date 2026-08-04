import { Instrument_Serif, Space_Grotesk } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const instrumentSerifRegular = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
    display: 'block',
    variable: '--font-instrument-serif-regular'
});

export const instrumentSerifItalic = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: 'italic',
    display: 'block',
    variable: '--font-instrument-serif-italic'
});
