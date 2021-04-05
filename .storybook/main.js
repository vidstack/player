const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['./bootstrap.js', '../storybook-build/**/*.stories.{js,ts,md,mdx}'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
  webpackFinal: async config => {
    config.resolve.fallback.crypto = false;

    config.module.rules = config.module.rules.filter(
      rule => !/(js|ts|css)/.test(String(rule.test)),
    );

    config.module.rules.unshift({
      test: /\.(js|mjs|ts|tsx)$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
        tsconfigRaw: require('../tsconfig-storybook.json'),
      },
    });

    config.module.rules.push({
      test: /\.css$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 },
        },
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'css',
            minify: true,
          },
        },
      ],
    });

    config.optimization.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
    ];

    return config;
  },
};
