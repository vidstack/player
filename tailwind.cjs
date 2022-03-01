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
  'idle',
  'loop',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'waiting'
].map((attr) => `media-${attr}`);

const sliderAttrs = ['dragging', 'pointing', 'interactive'];

const vidstackPlayerPlugin = plugin(function ({ addVariant }) {
  mediaAttrs.forEach((mediaAttr) => {
    addVariant(mediaAttr, `*[${mediaAttr}] &`);
  });

  sliderAttrs.forEach((sliderAttr) => {
    addVariant(sliderAttr, `*[${sliderAttr}] &`);
  });
});

module.exports = {
  ...vidstackPlayerPlugin,
  mediaAttrs,
  sliderAttrs
};
