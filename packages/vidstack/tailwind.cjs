const createPlugin = require('tailwindcss/plugin');

const mediaAttributes = [
  'autoplay-error',
  'autoplay',
  'buffering',
  'can-fullscreen',
  'can-load-poster',
  'can-load',
  'can-pip',
  'can-play',
  'can-seek',
  'captions',
  'controls',
  'ended',
  'error',
  'fullscreen',
  'ios-controls',
  'live-edge',
  'live',
  'loop',
  'muted',
  'paused',
  'pip',
  'playing',
  'playsinline',
  'preview',
  'seeking',
  'started',
  'waiting',
];

module.exports = createPlugin.withOptions(function (options) {
  const selector = options?.selector ?? (options?.webComponents ? 'media-player' : 'div'),
    prefixOpt = options?.prefix ?? options?.mediaPrefix,
    prefix = prefixOpt ? `${prefixOpt}-` : 'media-';

  return function ({ addVariant }) {
    // TODO: expose these
    // airplay
    // can-airplay
    // can-google-cast
    // google-cast
    // remote-state
    // remote-type
    // load
    // view-type
    // media-type
    // stream-type

    mediaAttributes.forEach((name) => {
      addVariant(`${prefix}${name}`, `${selector}[data-${name}] &`);
      addVariant(`not-${prefix}${name}`, `${selector}:not([data-${name}]) &`);
    });
  };
});
