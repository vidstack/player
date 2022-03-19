// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    },
  },
  plugins: [
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
