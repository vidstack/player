module.exports = {
  useTabs: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  plugins: [
    // `prettier-plugin-tailwindcss` also includes `prettier-plugin-svelte`
    // @see https://github.com/sveltejs/prettier-plugin-svelte#usage-with-tailwind-prettier-plugin
    require('prettier-plugin-tailwindcss'),
  ],
  overrides: [],
};
