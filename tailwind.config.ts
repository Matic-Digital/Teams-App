/* Use tailwind.config.ts for:
 * Complex utilities that need variants
 * Custom color schemes
 * Theme extensions
 * Reusable utility patterns */

/* Use globals.css for:
 * Base element styles
 * Simple component classes
 * CSS reset/normalization
 * Global CSS variables */

/** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    {
      // this is required because of how the <Box> component is generating responsive class names
      raw: String.raw`
        flex-row
        flex-col
        flex-wrap
        sm:flex-wrap
        md:flex-wrap
        lg:flex-wrap
        xl:flex-wrap
        2xl:flex-wrap
        flex-nowrap
        sm:flex-nowrap
        md:flex-nowrap
        lg:flex-nowrap
        xl:flex-nowrap
        2xl:flex-nowrap
        sm:flex-row
        sm:flex-col
        md:flex-row
        md:flex-col
        lg:flex-row
        lg:flex-col
        xl:flex-row
        xl:flex-col
        2xl:flex-row
        2xl:flex-col
        grid-cols-1
        grid-cols-2
        grid-cols-3
        grid-cols-4
        grid-cols-5
        grid-cols-6
        grid-cols-7
        grid-cols-8
        grid-cols-9
        grid-cols-10
        grid-cols-11
        grid-cols-12
        sm:grid-cols-1
        sm:grid-cols-2
        sm:grid-cols-3
        sm:grid-cols-4
        sm:grid-cols-5
        sm:grid-cols-6
        sm:grid-cols-7
        sm:grid-cols-8
        sm:grid-cols-9
        sm:grid-cols-10
        sm:grid-cols-11
        sm:grid-cols-12
        md:grid-cols-1
        md:grid-cols-2
        md:grid-cols-3
        md:grid-cols-4
        md:grid-cols-5
        md:grid-cols-6
        md:grid-cols-7
        md:grid-cols-8
        md:grid-cols-9
        md:grid-cols-10
        md:grid-cols-11
        md:grid-cols-12
        lg:grid-cols-1
        lg:grid-cols-2
        lg:grid-cols-3
        lg:grid-cols-4
        lg:grid-cols-5
        lg:grid-cols-6
        lg:grid-cols-7
        lg:grid-cols-8
        lg:grid-cols-9
        lg:grid-cols-10
        lg:grid-cols-11
        lg:grid-cols-12
        sm:gap-0
        sm:gap-1
        sm:gap-2
        sm:gap-3
        sm:gap-4
        sm:gap-5
        sm:gap-6
        sm:gap-8
        sm:gap-10
        sm:gap-12
        md:gap-0
        md:gap-1
        md:gap-2
        md:gap-3
        md:gap-4
        md:gap-5
        md:gap-6
        md:gap-8
        md:gap-10
        md:gap-12
        lg:gap-0
        lg:gap-1
        lg:gap-2
        lg:gap-3
        lg:gap-4
        lg:gap-5
        lg:gap-6
        lg:gap-8
        lg:gap-10
        lg:gap-12
        xl:gap-0
        xl:gap-1
        xl:gap-2
        xl:gap-3
        xl:gap-4
        xl:gap-5
        xl:gap-6
        xl:gap-8
        xl:gap-10
        xl:gap-12
        2xl:gap-0
        2xl:gap-1
        2xl:gap-2
        2xl:gap-3
        2xl:gap-4
        2xl:gap-5
      `
    }
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
      // screens: {
      //   '2xl': '1400px'
      // }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(10px)' }
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        },
        'scale-down': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' }
        },
        'subtle-scale': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'slide-right': 'slide-right 0.2s ease-out forwards',
        'scale-up': 'scale-up 0.2s ease-out forwards',
        'scale-down': 'scale-down 0.2s ease-out forwards',
        'subtle-scale': 'subtle-scale 0.2s ease-out forwards'
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'Inter, sans-serif',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'hsl(var(--primary))',
                borderBottomColor: 'hsl(var(--primary))'
              },
              '&:active': {
                color: 'hsl(var(--primary-foreground))',
                backgroundColor: 'hsl(var(--primary))',
                borderBottomColor: 'transparent',
                borderRadius: '0.25rem'
              }
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--primary))',
              color: 'hsl(var(--muted-foreground))'
            },
            h1: {
              color: 'hsl(var(--foreground))'
            },
            h2: {
              color: 'hsl(var(--foreground))'
            },
            h3: {
              color: 'hsl(var(--foreground))'
            },
            h4: {
              color: 'hsl(var(--foreground))'
            },
            strong: {
              color: 'hsl(var(--foreground))'
            },
            kbd: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))'
            },
            th: {
              color: 'hsl(var(--foreground))'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '0.25rem',
              padding: '0.2rem 0.4rem'
            },
            'ol > li::marker': {
              color: 'hsl(var(--primary))',
              fontWeight: '600'
            }
          }
        },
        dark: {
          css: {
            fontFamily: 'Inter, sans-serif',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'hsl(var(--primary))',
                borderBottomColor: 'hsl(var(--primary))'
              },
              '&:active': {
                color: 'hsl(var(--primary-foreground))',
                backgroundColor: 'hsl(var(--primary))',
                borderBottomColor: 'transparent'
              }
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--primary))',
              color: 'hsl(var(--muted-foreground))'
            },
            h1: {
              color: 'hsl(var(--foreground))'
            },
            h2: {
              color: 'hsl(var(--foreground))'
            },
            h3: {
              color: 'hsl(var(--foreground))'
            },
            h4: {
              color: 'hsl(var(--foreground))'
            },
            strong: {
              color: 'hsl(var(--foreground))'
            },
            kbd: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))'
            },
            th: {
              color: 'hsl(var(--foreground))'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--muted))'
            },
            'ol > li::marker': {
              color: 'hsl(var(--primary))'
            }
          }
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        maticgreen: 'hsl(var(--matic-green))',
        maticgreenbg: 'hsl(var(--matic-green-bg))',
        maticgreenborder: 'hsl(var(--matic-green-border))',
        designpurplebg: 'hsl(var(--design-bg))',
        designpurple: 'hsl(var(--design-purple))',
        designpurpleborder: 'hsl(var(--design-border))',
        designbg: 'hsl(var(--design-bg))',
        engblue: 'hsl(var(--eng-blue))',
        engbluebg: 'hsl(var(--eng-bg))',
        engblueborder: 'hsl(var(--eng-border))',
        manpink: 'hsl(var(--man-pink))',
        manpinkbg: 'hsl(var(--man-bg))',
        manpinkborder: 'hsl(var(--man-border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    tailwindcssAnimate,
    function ({
      addUtilities
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        '.text-gradient-pink': {
          '@apply bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent':
            ''
        },
        '.text-gradient-cyan': {
          '@apply bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent':
            ''
        },
        '.text-gradient-emerald': {
          '@apply bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent':
            ''
        },
        '.text-gradient-orange': {
          '@apply bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent':
            ''
        },
        '.bg-design-purple': {
          '@apply bg-[#7756C9]':
            ''
        },
        '.bg-engineering-blue': {
          '@apply bg-[#157DEF]':
            ''
        },
        '.bg-management-red': {
          '@apply bg-[#DD2590]':
            ''
        },
        '.bg-strategy-pink': {
          '@apply bg-[#7756C9]':
            ''
        },
        '.text-design-purple': {
          '@apply text-[#7756C9]':
            ''
        },
        '.text-engineering-blue': {
          '@apply text-[#157DEF]':
            ''
        },
        '.text-management-red': {
          '@apply text-[#DD2590]':
            ''
        },
        '.text-strategy-pink': {
          '@apply text-[#7756C9]':
            ''
        }
      });
    }
  ]
} satisfies Config;
