module.exports = {
  useTabs: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  plugins: [
    require.resolve('prettier-plugin-svelte'),
    require.resolve('./node_modules/prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss'),
    require.resolve('@ianvs/prettier-plugin-sort-imports'),
  ],
  // Astro
  astroAllowShorthand: false,
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
  // Sort Imports
  importOrder: [
    '^react$',
    '^next',
    '~.*icons',
    '.css$',
    '^node:',
    'clsx',
    '<THIRD_PARTY_MODULES>',
    '.webp?$',
    '.mp4?$',
    '^[$]',
    '^[../]',
    '^(?!.*[.](png|webp|mp4)$)[./].*$',
  ],
  importOrderParserPlugins: ['jsx', 'typescript', 'decorators'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
