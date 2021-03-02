module.exports = {
  stories: ['./bootstrap.ts', '../src/**/*.stories.{ts,md,mdx}'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
};
