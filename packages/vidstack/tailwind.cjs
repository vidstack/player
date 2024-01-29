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
    function createVariant(name, attrName = name, extend = '') {
      addVariant(`${prefix}${name}`, `${selector}[data-${attrName}]${extend} &`);
      addVariant(`not-${prefix}${name}`, `${selector}:not([data-${attrName}]${extend}) &`);
    }

    // media-type + view type
    for (const type of ['audio', 'video', 'unknown']) {
      // e.g, media-video: => data-media-type="video"
      createVariant(type, `media-type="${type}"`);
      // e.g, media-view-video: => data-view-type="video"
      createVariant(`view-${type}`, `view-type="${type}"`);
    }

    // stream type
    const streamTypes = {
      unknown: 'unknown',
      demand: 'on-demand',
      live: 'live',
      dvr: 'live:dvr',
      ll: 'll-live',
      'll-dvr': 'll-live:dvr',
    };

    for (const [type, attrName] of Object.entries(streamTypes)) {
      // e.g, media-stream-live: => data-stream-type="video"
      createVariant(`stream-${type}`, `stream-type="${attrName}"`);
    }

    // remote playback state
    for (const state of ['connected', 'connecting', 'disconnected']) {
      // e.g, media-remote-connecting: => data-remote-state="connecting"
      createVariant(`remote-${state}`, `remote-state="${state}"`);
    }

    // remote playback
    const remoteTypeAlias = { airplay: 'air', 'google-cast': 'cast' };

    for (const attr of ['airplay', 'can-airplay']) {
      const name = attr.replace('airplay', remoteTypeAlias.airplay);
      createVariant(name, attr);
    }

    for (const attr of ['google-cast', 'can-google-cast']) {
      const name = attr.replace('google-cast', remoteTypeAlias['google-cast']);
      createVariant(name, attr);
    }

    for (const type of ['airplay', 'google-cast']) {
      for (const state of ['connecting', 'disconnected']) {
        // e.g, media-air-connecting: => [data-remote-type="airplay"][data-remote-state="connecting"]
        createVariant(
          `${remoteTypeAlias[type]}-${state}`,
          `remote-type="${type}"`,
          `[data-remote-state="${state}"]`,
        );
      }
    }

    for (const name of mediaAttributes) {
      createVariant(name);
    }
  };
});
