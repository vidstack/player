module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['./bootstrap.js', '../src/**/*.stories.{js}'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
};
