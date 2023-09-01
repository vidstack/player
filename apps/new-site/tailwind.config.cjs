/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{md,html,astro,svelte}'],
  experimental: {
    optimizeUniversalDefaults: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      sans: ['var(--font-family-sans)'],
      mono: ['var(--font-family-mono)'],
    },
    screens: {
      420: '420px',
      576: '576px',
      768: '768px',
      992: '992px',
      1200: '1200px',
      1280: '1280px',
      1400: '1400px',
      1440: '1440px',
      1460: '1460px',
      1480: '1480px',
      'nav-lg': '825px',
    },
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        gray: {},
        border: 'rgb(var(--color-border) / <alpha-value>)',
        soft: 'rgb(var(--color-soft) / <alpha-value>)',
        inverse: 'rgb(var(--color-inverse) / <alpha-value>)',
        body: 'rgb(var(--color-body) / <alpha-value>)',
        elevate: 'rgb(var(--color-elevate) / <alpha-value>)',
        'code-tag': 'rgb(var(--color-code-tag) / <alpha-value>)',
        'code-fn': 'rgb(var(--color-code-fn) / <alpha-value>)',
      },
      animation: {
        indeterminate: 'indeterminate 1.2s linear infinite',
      },
      keyframes: {
        levitate: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(4px)' },
          '70%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        indeterminate: {
          '0%': { transform: 'translateX(0) scaleX(0)' },
          '40%': { transform: 'translateX(0) scaleX(0.4)' },
          '100%': { transform: 'translateX(100%) scaleX(0.5)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('vidstack/tailwind.cjs'),
    customVariants,
  ],
};

function customVariants({ addVariant }) {
  addVariant(
    'supports-backdrop-blur',
    '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))',
  );
  addVariant('child', '& > *');
  addVariant('first-child', '& > *:first-child');
  addVariant('hocus', ['&:hover', '&:focus-visible']);
  addVariant('scrolled', ['body[data-scrolled] &']);
  addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &']);
}
