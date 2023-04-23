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
    require('@ianvs/prettier-plugin-sort-imports'),
  ],
  importOrder: ['.css$', '^node:', '<THIRD_PARTY_MODULES>', '^[$]', '^[../]', '^[./]'],
  importOrderParserPlugins: ['jsx', 'typescript', 'decorators'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
