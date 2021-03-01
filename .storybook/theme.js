import { create } from '@web/storybook-prebuilt/theming';

export default isProduction =>
  create({
    base: 'dark',
    brandTitle: 'Vidstack Player',
    brandUrl: 'https://vidstack.io',
    brandImage: isProduction
      ? '/storybook.png'
      : '.storybook/public/storybook.png',
  });
