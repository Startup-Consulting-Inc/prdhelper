/**
 * Tailwind CSS Configuration
 *
 * Styling configuration with custom color palette and typography.
 * Supports dark mode and includes Inter font family.
 *
 * Recent Changes:
 * - [2025-10-27] FEAT: Added Tailwind config with custom primary colors and fonts
 * - [2026-03-21] FEAT: Added prose typography overrides for improved reading experience
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h2: {
              paddingLeft: theme('spacing.4'),
              borderLeft: `3px solid ${theme('colors.primary.500')}`,
              marginTop: theme('spacing.10'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.400'),
              borderLeftWidth: '3px',
              fontStyle: 'normal',
              fontWeight: '500',
              color: theme('colors.gray.700'),
              backgroundColor: theme('colors.primary.50'),
              borderRadius: theme('borderRadius.lg'),
              paddingTop: theme('spacing.4'),
              paddingBottom: theme('spacing.4'),
              paddingRight: theme('spacing.6'),
            },
            a: {
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': { textDecoration: 'underline' },
            },
          },
        },
        invert: {
          css: {
            blockquote: {
              color: theme('colors.gray.200'),
              backgroundColor: 'rgba(30, 58, 138, 0.2)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
