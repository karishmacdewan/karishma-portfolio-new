/* eslint-disable */

const defaultTheme = require('tailwindcss/defaultTheme');
const svgToDataUri = require('mini-svg-data-uri');
const colors = require('tailwindcss/colors');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
    safelist: [
        'bg-blue-200',
        'bg-blue-300',
        'bg-blue-400',
        'bg-blue-500',
        'bg-blue-600',
        'bg-blue-700',
        'bg-blue-800',
        'opacity-10',
        'o-20',
        'o-30',
        'o-40',
        'o-50',
        'rounded-b-full',
        'rounded-t-full',
        'col-span-1',
        'col-span-2',
        'col-span-3',
        'z-0',
        'z-10',
        'z-20',
        'z-30',
        'z-40',
        'md:col-span-1',
        'md:col-span-2',
        'md:col-span-3',
        'lg:col-span-1',
        'lg:col-span-2',
        'lg:col-span-3'
    ],
    darkMode: ['class'],
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        borderWidth: {
            DEFAULT: '1px',
            0: '0',
            2: '2px',
            3: '3px',
            4: '4px',
            6: '6px',
            8: '8px',
            10: '10px',
            20: '20px'
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                // added from inspo > vurak
                purple: {
                    dark: '#26004c',
                    darker: '#190033',
                    'even-darker': '#0c0019'
                },
                blue: {
                    dark: '#373c63',
                    darker: '#292d4a',
                    'even-darker': '#1b1e31',
                    'even-darker2': '#0d0f18'
                },
                wood: {
                    dark: '#402F2F'
                },
                linen: '#F1E6DA',
                ink: '#27221f'
                // endof added from inspo > vurak
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            animation: {
                spotlight: 'spotlight 2s ease .75s 1 forwards',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            transitionDuration: {
                2000: '2000ms'
            },
            transitionDelay: {
                1500: '1500ms'
            },
            height: {
                200: '35rem',
                'full1.5': '150%',
                full2: '200%',
                'full2.5': '250%',
                full3: '300%'
            },
            width: {
                'full1.1': '110%',
                'full1.5': '150%',
                full2: '200%',
                'full2.5': '250%'
            },
            margin: {
                '-14p': '-14px',
                100: '25rem',
                120: '27.5rem',
                130: '30rem',
                0.25: '0.062rem',
                0.2: '0.02rem'
            },
            scale: {
                200: '2',
                250: '2.5'
            },
            transitionProperty: {
                height: 'height'
            },
            keyframes: {
                spotlight: {
                    '0%': {
                        opacity: 0,
                        transform: 'translate(-72%, -62%) scale(0.5)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translate(-50%,-40%) scale(1)'
                    }
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            }
        }
    },
    plugins: [
        require('tailwindcss-animate'),
        addVariablesForColors,
        function ({ matchUtilities, theme }: any) {
            matchUtilities(
                {
                    'bg-grid': (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`
                    }),
                    'bg-grid-small': (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`
                    }),
                    'bg-dot': (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`
                    })
                },
                {
                    values: flattenColorPalette(theme('backgroundColor')),
                    type: 'color'
                }
            );
        }
    ]
};

function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme('colors'));
    let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

    addBase({
        ':root': newVars
    });
}
