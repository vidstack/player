const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'duration',
  'captions',
  'can-fullscreen',
  'can-pip',
  'can-load',
  'can-play',
  'can-seek',
  'ended',
  'error',
  'fullscreen',
  'user-idle',
  'loop',
  'live',
  'live-edge',
  'muted',
  'paused',
  'pip',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'waiting',
];

module.exports = createPlugin.withOptions(function (options) {
  const prefixOpt = options?.prefix ?? options?.mediaPrefix;
  const prefix = prefixOpt ? `${prefixOpt}-` : '';

  return function ({ addBase, addVariant }) {
    mediaAttributes.forEach((name) => {
      addVariant(`${prefix}${name}`, `media-player[data-${name}] &`);
      addVariant(`not-${prefix}${name}`, `media-player:not([data-${name}]) &`);
    });

    // buffering
    addVariant(`${prefix}buffering`, [
      `media-player:not([data-can-play]) &`,
      `media-player[data-waiting] &`,
    ]);
    addVariant(`not-${prefix}buffering`, [`media-player[data-can-play]:not([data-waiting]) &`]);

    // can-control
    addBase({
      [`media-player[data-ios-controls] *[class*="${prefix}can-control"]`]: {
        display: 'none !important',
      },
    });
    addVariant(`${prefix}can-control`, [`media-player[data-can-play]:not([data-user-idle]) &`]);
    addVariant(`not-${prefix}can-control`, [
      `media-player[data-ios-controls] &`,
      `media-player[data-user-idle] &`,
      `media-player:not([data-can-play]) &`,
    ]);
  };
});
