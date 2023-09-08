const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'buffering',
  'captions',
  'can-fullscreen',
  'can-pip',
  'can-load',
  'can-play',
  'can-seek',
  'ended',
  'error',
  'fullscreen',
  'controls',
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
  const prefix = prefixOpt ? `${prefixOpt}-` : 'media-';
  return function ({ addVariant }) {
    mediaAttributes.forEach((name) => {
      addVariant(`${prefix}${name}`, `[data-${name}] &`);
      addVariant(`not-${prefix}${name}`, `[data-media-player]:not([data-${name}]) &`);
    });
  };
});
