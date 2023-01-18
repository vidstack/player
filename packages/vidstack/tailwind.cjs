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

const vidstackPlugin = createPlugin(function ({ addVariant }) {
  mediaAttributes.forEach((mediaAttr) => {
    addVariant(`media-${mediaAttr}`, `vds-media[${mediaAttr}] &`);
  });

  sliderAttributes.forEach((sliderAttr) => {
    addVariant(sliderAttr, `vds-media *[${sliderAttr}] &`);
  });
});

module.exports = {
  ...vidstackPlugin,
  mediaAttributes,
  sliderAttributes,
};
