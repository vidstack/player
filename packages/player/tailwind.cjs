/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

const mediaAttrs = [
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

const sliderAttrs = ['dragging', 'pointing', 'interactive'];

const vidstackPlayerPlugin = plugin(function ({ addVariant }) {
  mediaAttrs.forEach((mediaAttr) => {
    addVariant(`media-${mediaAttr}`, `vds-media[${mediaAttr}] &`);
  });

  sliderAttrs.forEach((sliderAttr) => {
    addVariant(sliderAttr, `vds-media *[${sliderAttr}] &`);
  });
});

module.exports = {
  ...vidstackPlayerPlugin,
  mediaAttrs,
  sliderAttrs,
};
