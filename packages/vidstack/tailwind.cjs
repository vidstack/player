const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'duration',
  'can-fullscreen',
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
      addVariant(`${prefix}${name}`, `media-player[${name}] &`);
      addVariant(`not-${prefix}${name}`, `media-player:not([${name}]) &`);
    });

    // buffering
    addVariant(`${prefix}buffering`, [`media-player:not([can-play]) &`, `media-player[waiting] &`]);
    addVariant(`not-${prefix}buffering`, [`media-player[can-play]:not([waiting]) &`]);

    // can-control
    addBase({
      [`media-player[ios-controls] *[class*="${prefix}can-control"]`]: {
        display: 'none !important',
      },
    });
    addVariant(`${prefix}can-control`, [`media-player[can-play]:not([user-idle]) &`]);
    addVariant(`not-${prefix}can-control`, [
      `media-player[ios-controls] &`,
      `media-player[user-idle] &`,
      `media-player:not([can-play]) &`,
    ]);
  };
});
