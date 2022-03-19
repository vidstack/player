const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: ['./src/**/*.{html,svelte,md,js,ts}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter VF', ...defaultTheme.fontFamily.sans],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'SF Mono',
        'Menlo',
        'Consolas',
        'Liberation',
        'Mono',
        'Fira Code VF',
        'monospace',
      ],
    },
    screens: {
      420: '420px',
      576: '576px',
      768: '768px',
      992: '992px',
      1200: '1200px',
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand)',
          50: '#F87EA7',
          100: '#E8E8E8',
          200: '#F76998',
          300: '#F75A8E',
          400: '#F64C84',
          500: '#F53D7A',
          600: '#F30C59',
          700: '#C20A47',
          800: '#920735',
          900: '#610523',
        },
        gray: {
          DEFAULT: '#313131',
          50: '#FFFFFF',
          100: '#FBFBFB',
          200: '#EAEAEA',
          300: '#a5a5a5',
          400: '#616161',
          500: '#313131',
          600: '#292929',
          700: '#222222',
          800: '#1A1A1A',
          900: '#121212',
          divider: 'var(--color-gray-divider)',
          soft: 'var(--color-gray-soft)',
          inverse: 'var(--color-gray-inverse)',
          current: 'var(--color-gray-current)',
          hover: 'var(--color-gray-hover)',
          'hover-inverse': 'var(--color-gray-hover-inverse)',
          elevate: 'var(--color-gray-elevate)',
          body: 'var(--color-gray-body)',
        },
        code: {
          highlight: 'rgb(125 211 252 / 0.1)',
        },
      },
      keyframes: {
        'flash-code': {
          '0%': { backgroundColor: 'rgb(125 211 252 / 0.1)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'brand-text-colors': {
          '0%': { color: '#ff6418' },
          '33%': { color: '#e72828' },
          '66%': { color: '#f64480' },
          '100%': { color: '#ff6418' },
        },
      },
      animation: {
        'flash-code': 'flash-code 1s forwards',
        'flash-code-slow': 'flash-code 2s forwards',
        'brand-text-colors': 'brand-text-colors 15s infinite',
      },
      typography: typography(),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms')({
    // 	strategy: 'class'
    // }),
    function ({ addVariant }) {
      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))',
      );
      addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
      addVariant('children', '& > *');
      addVariant('scrollbar', '&::-webkit-scrollbar');
      addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
      addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
    },
  ],
};

function typography() {
  return (theme) => ({
    DEFAULT: {
      css: {
        color: theme('colors.gray.soft'),
        fontSize: '18px',
        maxWidth: 'none',
        hr: {
          borderColor: theme('colors.gray.divider'),
          marginTop: '3em',
          marginBottom: '3em',
        },
        'h1, h2, h3': {
          letterSpacing: '-0.025em',
        },
        h2: {
          marginBottom: `${16 / 24}em`,
        },
        h3: {
          marginTop: '2.4em',
          lineHeight: '1.4',
        },
        h4: {
          marginTop: '1.75em',
          fontSize: '1.125em',
        },
        'h2 small, h3 small, h4 small': {
          fontFamily: theme('fontFamily.mono').join(', '),
          fontWeight: 500,
        },
        'h2 small': {
          fontSize: theme('fontSize.lg')[0],
          ...theme('fontSize.lg')[1],
        },
        'h3 small': {
          fontSize: theme('fontSize.base')[0],
          ...theme('fontSize.base')[1],
        },
        'h4 small': {
          fontSize: theme('fontSize.sm')[0],
          ...theme('fontSize.sm')[1],
        },
        ul: {
          paddingLeft: '1rem',
        },
        'ul > li': {
          position: 'relative',
          paddingLeft: '0.25rem',
        },
        'ul > li::marker': {
          color: theme('colors.gray.inverse'),
        },
        'ul > li::before': {
          content: '""',
          width: '0.75em',
          height: '0.125em',
          position: 'absolute',
          top: 'calc(0.875em - 0.0625em)',
          left: 0,
          borderRadius: '999px',
        },
        'li > p': {
          margin: 0,
        },
        a: {
          fontWeight: theme('fontWeight.semibold'),
          textDecoration: 'none',
          borderBottom: `1px solid var(--color-brand)`,
        },
        'a:hover': {
          borderBottomWidth: '2px',
        },
        'a code': {
          color: 'inherit',
          fontWeight: 'inherit',
        },
        strong: {
          fontWeight: theme('fontWeight.semibold'),
        },
        'a strong': {
          color: 'inherit',
          fontWeight: 'inherit',
        },
        code: {
          fontWeight: theme('fontWeight.medium'),
          fontVariantLigatures: 'none',
        },
        pre: {
          backgroundColor: 'var(--prose-pre-bg)',
          boxShadow: 'none',
          display: 'flex',
        },
        'p + pre': {
          marginTop: `${-4 / 14}em`,
        },
        'pre code': {
          flex: 'none',
          minWidth: '100%',
        },
        table: {
          margin: 0,
          width: '100%',
          borderCollapse: 'collapse',
        },
        thead: {
          color: theme('colors.gray.inverse'),
          borderBottomColor: theme('colors.gray.divider'),
        },
        tbody: {
          verticalAlign: 'baseline',
        },
        'thead th': {
          paddingTop: 0,
          fontWeight: theme('fontWeight.semibold'),
        },
        'tbody tr': {
          fontSize: theme('fontSize.sm')[0],
          borderBottomColor: theme('colors.gray.divider'),
        },
        'tbody td': {
          whiteSpace: 'nowrap',
        },
        'tbody tr:nth-child(odd)': {
          backgroundColor: theme('colors.gray.100'),
        },
        'tbody tr:last-child': {
          borderBottomWidth: '1px',
        },
        'tbody code': {
          fontSize: theme('fontSize.sm')[0],
        },
        'tbody tr td:first-child code': {
          color: theme('colors.indigo.500'),
          paddingLeft: '8px',
          '&::before': { display: 'none' },
          '&::after': { display: 'none' },
        },
        'figure figcaption': {
          textAlign: 'center',
          fontStyle: 'italic',
        },
        'figure > figcaption': {
          marginTop: `${12 / 14}em`,
        },
        blockQuote: {
          color: theme('colors.gray.inverse'),
          borderRadius: 2,
          borderColor: 'currentColor',
        },
      },
    },
    invert: {
      css: {
        'tbody tr:nth-child(odd)': {
          backgroundColor: theme('colors.gray.700'),
        },
        'tbody tr td:first-child code': {
          color: theme('colors.indigo.300'),
        },
      },
    },
  });
}
