const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'duration',
  'can-load',
  'can-play',
  'can-fullscreen',
  'ended',
  'error',
  'fullscreen',
  'user-idle',
  'loop',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'waiting',
];

const sliderAttributes = ['dragging', 'pointing', 'interactive'];

module.exports = createPlugin.withOptions(function (options) {
  const mediaPrefix = options?.mediaPrefix ? `${options.mediaPrefix}-` : '';
  const sliderPrefix = options?.sliderPrefix ? `${options.sliderPrefix}-` : '';

  return function ({ addBase, addVariant }) {
    mediaAttributes.forEach((name) => {
      addVariant(`${mediaPrefix}${name}`, `media-player[${name}] &`);
      addVariant(`not-${mediaPrefix}${name}`, `media-player:not([${name}]) &`);
    });

    // buffering
    addVariant(`${mediaPrefix}buffering`, [
      `media-player:not([can-play]) &`,
      `media-player[waiting] &`,
    ]);
    addVariant(`not-${mediaPrefix}buffering`, [`media-player[can-play]:not([waiting]) &`]);

    // can-control
    addBase({
      [`media-player[ios-controls] *[class*="${mediaPrefix}can-control"]`]: {
        display: 'none !important',
      },
    });
    addVariant(`${mediaPrefix}can-control`, [`media-player[can-play]:not([user-idle]) &`]);
    addVariant(`not-${mediaPrefix}can-control`, [
      `media-player[ios-controls] &`,
      `media-player[user-idle] &`,
      `media-player:not([can-play]) &`,
    ]);

    // slider
    sliderAttributes.forEach((name) => {
      addVariant(`${sliderPrefix}${name}`, `media-player *[role="slider"][${name}] &`);
    });

    // toggle
    addVariant('pressed', `[role="button"][pressed] &`);
    addVariant('not-pressed', `[role="button"]:not([pressed]) &`);

    // volume
    addVariant(`${mediaPrefix}volume-low`, `media-mute-button[volume-low] &`);
    addVariant(`not-${mediaPrefix}volume-low`, `media-mute-button:not([volume-low]) &`);
    addVariant(`${mediaPrefix}volume-high`, `media-mute-button[volume-high] &`);
    addVariant(`not${mediaPrefix}volume-high`, `media-mute-button:not([volume-high]) &`);
  };
});
