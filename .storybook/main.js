module.exports = {
  stories: ['./bootstrap.ts', '../storybook-build/**/*.stories.{js,ts,md,mdx}'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
};
