/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  plugins: [
    require('tailwindcss-animate'),
    require('@vidstack/react/tailwind.cjs'),
    ({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus-visible']);
      addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &']);
    },
  ],
};
