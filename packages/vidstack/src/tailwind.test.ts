import path from 'path';

import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import vidstackPlugin, { type PluginOptions } from '../npm/tailwind.cjs';

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
  // media types
  'audio',
  'video',
  'unknown',
  // view types
  'view-audio',
  'view-video',
  'view-unknown',
  // stream types
  'stream-unknown',
  'stream-demand',
  'stream-live',
  'stream-dvr',
  'stream-ll',
  'stream-ll-dvr',
  // remote playback
  'air',
  'can-air',
  'can-cast',
  'cast',
  // remote playback state
  'remote-connected',
  'remote-connecting',
  'remote-disconnected',
  // remote playback type + state
  'air-connecting',
  'air-disconnected',
  'cast-connecting',
  'cast-disconnected',
];

async function run(content: string, options?: PluginOptions) {
  return postcss([
    tailwindcss({
      content: [{ raw: content }],
      corePlugins: { preflight: false },
      plugins: [vidstackPlugin(options)],
    }),
  ])
    .process(['@tailwind components;', '@tailwind utilities;'].join('\n'), {
      from: `${path.resolve(__filename)}?test=${'should create variants'}`,
    })
    .then((c) => c.css);
}

it('should create media variants', async () => {
  const content = mediaAttributes.map((name) => `media-${name}:hidden`).join(' '),
    css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "div[data-media-type=\\"audio\\"] .media-audio\\\\:hidden {
        display: none
    }
    div[data-view-type=\\"audio\\"] .media-view-audio\\\\:hidden {
        display: none
    }
    div[data-media-type=\\"video\\"] .media-video\\\\:hidden {
        display: none
    }
    div[data-view-type=\\"video\\"] .media-view-video\\\\:hidden {
        display: none
    }
    div[data-media-type=\\"unknown\\"] .media-unknown\\\\:hidden {
        display: none
    }
    div[data-view-type=\\"unknown\\"] .media-view-unknown\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"unknown\\"] .media-stream-unknown\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"on-demand\\"] .media-stream-demand\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"live\\"] .media-stream-live\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"live:dvr\\"] .media-stream-dvr\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"ll-live\\"] .media-stream-ll\\\\:hidden {
        display: none
    }
    div[data-stream-type=\\"ll-live:dvr\\"] .media-stream-ll-dvr\\\\:hidden {
        display: none
    }
    div[data-remote-state=\\"connected\\"] .media-remote-connected\\\\:hidden {
        display: none
    }
    div[data-remote-state=\\"connecting\\"] .media-remote-connecting\\\\:hidden {
        display: none
    }
    div[data-remote-state=\\"disconnected\\"] .media-remote-disconnected\\\\:hidden {
        display: none
    }
    div[data-airplay] .media-air\\\\:hidden {
        display: none
    }
    div[data-can-airplay] .media-can-air\\\\:hidden {
        display: none
    }
    div[data-google-cast] .media-cast\\\\:hidden {
        display: none
    }
    div[data-can-google-cast] .media-can-cast\\\\:hidden {
        display: none
    }
    div[data-remote-type=\\"airplay\\"][data-remote-state=\\"connecting\\"] .media-air-connecting\\\\:hidden {
        display: none
    }
    div[data-remote-type=\\"airplay\\"][data-remote-state=\\"disconnected\\"] .media-air-disconnected\\\\:hidden {
        display: none
    }
    div[data-remote-type=\\"google-cast\\"][data-remote-state=\\"connecting\\"] .media-cast-connecting\\\\:hidden {
        display: none
    }
    div[data-remote-type=\\"google-cast\\"][data-remote-state=\\"disconnected\\"] .media-cast-disconnected\\\\:hidden {
        display: none
    }
    div[data-autoplay-error] .media-autoplay-error\\\\:hidden {
        display: none
    }
    div[data-autoplay] .media-autoplay\\\\:hidden {
        display: none
    }
    div[data-buffering] .media-buffering\\\\:hidden {
        display: none
    }
    div[data-can-fullscreen] .media-can-fullscreen\\\\:hidden {
        display: none
    }
    div[data-can-load-poster] .media-can-load-poster\\\\:hidden {
        display: none
    }
    div[data-can-load] .media-can-load\\\\:hidden {
        display: none
    }
    div[data-can-pip] .media-can-pip\\\\:hidden {
        display: none
    }
    div[data-can-play] .media-can-play\\\\:hidden {
        display: none
    }
    div[data-can-seek] .media-can-seek\\\\:hidden {
        display: none
    }
    div[data-captions] .media-captions\\\\:hidden {
        display: none
    }
    div[data-controls] .media-controls\\\\:hidden {
        display: none
    }
    div[data-ended] .media-ended\\\\:hidden {
        display: none
    }
    div[data-error] .media-error\\\\:hidden {
        display: none
    }
    div[data-fullscreen] .media-fullscreen\\\\:hidden {
        display: none
    }
    div[data-ios-controls] .media-ios-controls\\\\:hidden {
        display: none
    }
    div[data-live-edge] .media-live-edge\\\\:hidden {
        display: none
    }
    div[data-live] .media-live\\\\:hidden {
        display: none
    }
    div[data-loop] .media-loop\\\\:hidden {
        display: none
    }
    div[data-muted] .media-muted\\\\:hidden {
        display: none
    }
    div[data-paused] .media-paused\\\\:hidden {
        display: none
    }
    div[data-pip] .media-pip\\\\:hidden {
        display: none
    }
    div[data-playing] .media-playing\\\\:hidden {
        display: none
    }
    div[data-playsinline] .media-playsinline\\\\:hidden {
        display: none
    }
    div[data-preview] .media-preview\\\\:hidden {
        display: none
    }
    div[data-seeking] .media-seeking\\\\:hidden {
        display: none
    }
    div[data-started] .media-started\\\\:hidden {
        display: none
    }
    div[data-waiting] .media-waiting\\\\:hidden {
        display: none
    }"
  `);
});

it('should create _not_ media variants', async () => {
  const content = mediaAttributes.map((name) => `not-media-${name}:hidden`).join(' '),
    css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "div:not([data-media-type=\\"audio\\"]) .not-media-audio\\\\:hidden {
        display: none
    }
    div:not([data-view-type=\\"audio\\"]) .not-media-view-audio\\\\:hidden {
        display: none
    }
    div:not([data-media-type=\\"video\\"]) .not-media-video\\\\:hidden {
        display: none
    }
    div:not([data-view-type=\\"video\\"]) .not-media-view-video\\\\:hidden {
        display: none
    }
    div:not([data-media-type=\\"unknown\\"]) .not-media-unknown\\\\:hidden {
        display: none
    }
    div:not([data-view-type=\\"unknown\\"]) .not-media-view-unknown\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"unknown\\"]) .not-media-stream-unknown\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"on-demand\\"]) .not-media-stream-demand\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"live\\"]) .not-media-stream-live\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"live:dvr\\"]) .not-media-stream-dvr\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"ll-live\\"]) .not-media-stream-ll\\\\:hidden {
        display: none
    }
    div:not([data-stream-type=\\"ll-live:dvr\\"]) .not-media-stream-ll-dvr\\\\:hidden {
        display: none
    }
    div:not([data-remote-state=\\"connected\\"]) .not-media-remote-connected\\\\:hidden {
        display: none
    }
    div:not([data-remote-state=\\"connecting\\"]) .not-media-remote-connecting\\\\:hidden {
        display: none
    }
    div:not([data-remote-state=\\"disconnected\\"]) .not-media-remote-disconnected\\\\:hidden {
        display: none
    }
    div:not([data-airplay]) .not-media-air\\\\:hidden {
        display: none
    }
    div:not([data-can-airplay]) .not-media-can-air\\\\:hidden {
        display: none
    }
    div:not([data-google-cast]) .not-media-cast\\\\:hidden {
        display: none
    }
    div:not([data-can-google-cast]) .not-media-can-cast\\\\:hidden {
        display: none
    }
    div:not([data-remote-type=\\"airplay\\"][data-remote-state=\\"connecting\\"]) .not-media-air-connecting\\\\:hidden {
        display: none
    }
    div:not([data-remote-type=\\"airplay\\"][data-remote-state=\\"disconnected\\"]) .not-media-air-disconnected\\\\:hidden {
        display: none
    }
    div:not([data-remote-type=\\"google-cast\\"][data-remote-state=\\"connecting\\"]) .not-media-cast-connecting\\\\:hidden {
        display: none
    }
    div:not([data-remote-type=\\"google-cast\\"][data-remote-state=\\"disconnected\\"]) .not-media-cast-disconnected\\\\:hidden {
        display: none
    }
    div:not([data-autoplay-error]) .not-media-autoplay-error\\\\:hidden {
        display: none
    }
    div:not([data-autoplay]) .not-media-autoplay\\\\:hidden {
        display: none
    }
    div:not([data-buffering]) .not-media-buffering\\\\:hidden {
        display: none
    }
    div:not([data-can-fullscreen]) .not-media-can-fullscreen\\\\:hidden {
        display: none
    }
    div:not([data-can-load-poster]) .not-media-can-load-poster\\\\:hidden {
        display: none
    }
    div:not([data-can-load]) .not-media-can-load\\\\:hidden {
        display: none
    }
    div:not([data-can-pip]) .not-media-can-pip\\\\:hidden {
        display: none
    }
    div:not([data-can-play]) .not-media-can-play\\\\:hidden {
        display: none
    }
    div:not([data-can-seek]) .not-media-can-seek\\\\:hidden {
        display: none
    }
    div:not([data-captions]) .not-media-captions\\\\:hidden {
        display: none
    }
    div:not([data-controls]) .not-media-controls\\\\:hidden {
        display: none
    }
    div:not([data-ended]) .not-media-ended\\\\:hidden {
        display: none
    }
    div:not([data-error]) .not-media-error\\\\:hidden {
        display: none
    }
    div:not([data-fullscreen]) .not-media-fullscreen\\\\:hidden {
        display: none
    }
    div:not([data-ios-controls]) .not-media-ios-controls\\\\:hidden {
        display: none
    }
    div:not([data-live-edge]) .not-media-live-edge\\\\:hidden {
        display: none
    }
    div:not([data-live]) .not-media-live\\\\:hidden {
        display: none
    }
    div:not([data-loop]) .not-media-loop\\\\:hidden {
        display: none
    }
    div:not([data-muted]) .not-media-muted\\\\:hidden {
        display: none
    }
    div:not([data-paused]) .not-media-paused\\\\:hidden {
        display: none
    }
    div:not([data-pip]) .not-media-pip\\\\:hidden {
        display: none
    }
    div:not([data-playing]) .not-media-playing\\\\:hidden {
        display: none
    }
    div:not([data-playsinline]) .not-media-playsinline\\\\:hidden {
        display: none
    }
    div:not([data-preview]) .not-media-preview\\\\:hidden {
        display: none
    }
    div:not([data-seeking]) .not-media-seeking\\\\:hidden {
        display: none
    }
    div:not([data-started]) .not-media-started\\\\:hidden {
        display: none
    }
    div:not([data-waiting]) .not-media-waiting\\\\:hidden {
        display: none
    }"
  `);
});

it('should use web components option', async () => {
  const content = 'media-playing:hidden',
    css = await run(content, { webComponents: true });
  expect(css).toMatchInlineSnapshot(`
    "media-player[data-playing] .media-playing\\\\:hidden {
        display: none
    }"
  `);
});

it('should use player class option', async () => {
  const content = 'media-playing:hidden',
    css = await run(content, { selector: '.media-player' });
  expect(css).toMatchInlineSnapshot(`
    ".media-player[data-playing] .media-playing\\\\:hidden {
        display: none
    }"
  `);
});
