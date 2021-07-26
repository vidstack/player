const { resolve } = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  core: {
    builder: 'webpack5'
  },
  stories: ['../src/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    // '@storybook/addon-a11y',
    '@storybook/addon-links'
  ],
  webpackFinal: async (config) => {
    config.resolve.fallback.crypto = false;

    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: resolve(__dirname, '../tsconfig-build.json')
      })
    );

    config.module.rules = config.module.rules.filter(
      (rule) => !/(js|ts|css)/.test(String(rule.test))
    );

    config.module.rules.unshift({
      test: /\.(js|mjs|ts|tsx)$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'ts',
        target: 'es2015',
        sourcemap: true,
        tsconfigRaw: require('../tsconfig-build.json')
      }
    });

    config.module.rules.push({
      test: /\.css$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'css',
            minify: true,
            sourcemap: true
          }
        }
      ]
    });

    config.optimization.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015'
      })
    ];

    return config;
  }
};
