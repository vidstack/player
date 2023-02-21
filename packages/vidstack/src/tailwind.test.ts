import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import path from 'path';

import vidstackPlugin, { PluginOptions } from '../tailwind.cjs';

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
  'live',
  'live-edge',
  'muted',
  'paused',
  'playing',
  'playsinline',
  'seeking',
  'started',
  'waiting',
  // custom
  'can-control',
  'buffering',
];

const sliderAttributes = ['dragging', 'pointing', 'interactive'];

async function run(content: string, options?: PluginOptions) {
  return postcss([
    tailwindcss({
      content: [{ raw: content }],
      corePlugins: { preflight: false },
      plugins: [vidstackPlugin(options)],
    }),
  ]).process(['@tailwind components;', '@tailwind utilities;'].join('\n'), {
    from: `${path.resolve(__filename)}?test=${'should create variants'}`,
  }).css;
}

it('should create media variants', async () => {
  const content = mediaAttributes.map((name) => `${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "media-player[autoplay] .autoplay\\\\:hidden {
        display: none
    }
    media-player[autoplay-error] .autoplay-error\\\\:hidden {
        display: none
    }
    media-player[duration] .duration\\\\:hidden {
        display: none
    }
    media-player[can-load] .can-load\\\\:hidden {
        display: none
    }
    media-player[can-play] .can-play\\\\:hidden {
        display: none
    }
    media-player[can-fullscreen] .can-fullscreen\\\\:hidden {
        display: none
    }
    media-player[ended] .ended\\\\:hidden {
        display: none
    }
    media-player[error] .error\\\\:hidden {
        display: none
    }
    media-player[fullscreen] .fullscreen\\\\:hidden {
        display: none
    }
    media-player[user-idle] .user-idle\\\\:hidden {
        display: none
    }
    media-player[loop] .loop\\\\:hidden {
        display: none
    }
    media-player[live] .live\\\\:hidden {
        display: none
    }
    media-player[live-edge] .live-edge\\\\:hidden {
        display: none
    }
    media-player[muted] .muted\\\\:hidden {
        display: none
    }
    media-player[paused] .paused\\\\:hidden {
        display: none
    }
    media-player[playing] .playing\\\\:hidden {
        display: none
    }
    media-player[playsinline] .playsinline\\\\:hidden {
        display: none
    }
    media-player[seeking] .seeking\\\\:hidden {
        display: none
    }
    media-player[started] .started\\\\:hidden {
        display: none
    }
    media-player[waiting] .waiting\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .buffering\\\\:hidden {
        display: none
    }
    media-player[waiting] .buffering\\\\:hidden {
        display: none
    }
    media-player[can-play]:not([user-idle]) .can-control\\\\:hidden {
        display: none
    }"
  `);
});

it('should create _not_ media variants', async () => {
  const content = mediaAttributes.map((name) => `not-${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "media-player:not([autoplay]) .not-autoplay\\\\:hidden {
        display: none
    }
    media-player:not([autoplay-error]) .not-autoplay-error\\\\:hidden {
        display: none
    }
    media-player:not([duration]) .not-duration\\\\:hidden {
        display: none
    }
    media-player:not([can-load]) .not-can-load\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .not-can-play\\\\:hidden {
        display: none
    }
    media-player:not([can-fullscreen]) .not-can-fullscreen\\\\:hidden {
        display: none
    }
    media-player:not([ended]) .not-ended\\\\:hidden {
        display: none
    }
    media-player:not([error]) .not-error\\\\:hidden {
        display: none
    }
    media-player:not([fullscreen]) .not-fullscreen\\\\:hidden {
        display: none
    }
    media-player:not([user-idle]) .not-user-idle\\\\:hidden {
        display: none
    }
    media-player:not([loop]) .not-loop\\\\:hidden {
        display: none
    }
    media-player:not([live]) .not-live\\\\:hidden {
        display: none
    }
    media-player:not([live-edge]) .not-live-edge\\\\:hidden {
        display: none
    }
    media-player:not([muted]) .not-muted\\\\:hidden {
        display: none
    }
    media-player:not([paused]) .not-paused\\\\:hidden {
        display: none
    }
    media-player:not([playing]) .not-playing\\\\:hidden {
        display: none
    }
    media-player:not([playsinline]) .not-playsinline\\\\:hidden {
        display: none
    }
    media-player:not([seeking]) .not-seeking\\\\:hidden {
        display: none
    }
    media-player:not([started]) .not-started\\\\:hidden {
        display: none
    }
    media-player:not([waiting]) .not-waiting\\\\:hidden {
        display: none
    }
    media-player[can-play]:not([waiting]) .not-buffering\\\\:hidden {
        display: none
    }
    media-player[ios-controls] .not-can-control\\\\:hidden {
        display: none
    }
    media-player[user-idle] .not-can-control\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .not-can-control\\\\:hidden {
        display: none
    }"
  `);
});

it('should apply prefix to media variants', async () => {
  const content = mediaAttributes
    .map((name) => `media-${name}:hidden` + ` not-media-${name}:hidden`)
    .join(' ');
  const css = await run(content, { mediaPrefix: 'media' });
  expect(css).toMatchInlineSnapshot(`
    "media-player[autoplay] .media-autoplay\\\\:hidden {
        display: none
    }
    media-player:not([autoplay]) .not-media-autoplay\\\\:hidden {
        display: none
    }
    media-player[autoplay-error] .media-autoplay-error\\\\:hidden {
        display: none
    }
    media-player:not([autoplay-error]) .not-media-autoplay-error\\\\:hidden {
        display: none
    }
    media-player[duration] .media-duration\\\\:hidden {
        display: none
    }
    media-player:not([duration]) .not-media-duration\\\\:hidden {
        display: none
    }
    media-player[can-load] .media-can-load\\\\:hidden {
        display: none
    }
    media-player:not([can-load]) .not-media-can-load\\\\:hidden {
        display: none
    }
    media-player[can-play] .media-can-play\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .not-media-can-play\\\\:hidden {
        display: none
    }
    media-player[can-fullscreen] .media-can-fullscreen\\\\:hidden {
        display: none
    }
    media-player:not([can-fullscreen]) .not-media-can-fullscreen\\\\:hidden {
        display: none
    }
    media-player[ended] .media-ended\\\\:hidden {
        display: none
    }
    media-player:not([ended]) .not-media-ended\\\\:hidden {
        display: none
    }
    media-player[error] .media-error\\\\:hidden {
        display: none
    }
    media-player:not([error]) .not-media-error\\\\:hidden {
        display: none
    }
    media-player[fullscreen] .media-fullscreen\\\\:hidden {
        display: none
    }
    media-player:not([fullscreen]) .not-media-fullscreen\\\\:hidden {
        display: none
    }
    media-player[user-idle] .media-user-idle\\\\:hidden {
        display: none
    }
    media-player:not([user-idle]) .not-media-user-idle\\\\:hidden {
        display: none
    }
    media-player[loop] .media-loop\\\\:hidden {
        display: none
    }
    media-player:not([loop]) .not-media-loop\\\\:hidden {
        display: none
    }
    media-player[live] .media-live\\\\:hidden {
        display: none
    }
    media-player:not([live]) .not-media-live\\\\:hidden {
        display: none
    }
    media-player[live-edge] .media-live-edge\\\\:hidden {
        display: none
    }
    media-player:not([live-edge]) .not-media-live-edge\\\\:hidden {
        display: none
    }
    media-player[muted] .media-muted\\\\:hidden {
        display: none
    }
    media-player:not([muted]) .not-media-muted\\\\:hidden {
        display: none
    }
    media-player[paused] .media-paused\\\\:hidden {
        display: none
    }
    media-player:not([paused]) .not-media-paused\\\\:hidden {
        display: none
    }
    media-player[playing] .media-playing\\\\:hidden {
        display: none
    }
    media-player:not([playing]) .not-media-playing\\\\:hidden {
        display: none
    }
    media-player[playsinline] .media-playsinline\\\\:hidden {
        display: none
    }
    media-player:not([playsinline]) .not-media-playsinline\\\\:hidden {
        display: none
    }
    media-player[seeking] .media-seeking\\\\:hidden {
        display: none
    }
    media-player:not([seeking]) .not-media-seeking\\\\:hidden {
        display: none
    }
    media-player[started] .media-started\\\\:hidden {
        display: none
    }
    media-player:not([started]) .not-media-started\\\\:hidden {
        display: none
    }
    media-player[waiting] .media-waiting\\\\:hidden {
        display: none
    }
    media-player:not([waiting]) .not-media-waiting\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .media-buffering\\\\:hidden {
        display: none
    }
    media-player[waiting] .media-buffering\\\\:hidden {
        display: none
    }
    media-player[can-play]:not([waiting]) .not-media-buffering\\\\:hidden {
        display: none
    }
    media-player[can-play]:not([user-idle]) .media-can-control\\\\:hidden {
        display: none
    }
    media-player[ios-controls] .not-media-can-control\\\\:hidden {
        display: none
    }
    media-player[user-idle] .not-media-can-control\\\\:hidden {
        display: none
    }
    media-player:not([can-play]) .not-media-can-control\\\\:hidden {
        display: none
    }"
  `);
});

it('should create slider variants', async () => {
  const content = sliderAttributes.map((name) => `${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "media-player *[role=\\"slider\\"][dragging] .dragging\\\\:hidden {
        display: none
    }
    media-player *[role=\\"slider\\"][pointing] .pointing\\\\:hidden {
        display: none
    }
    media-player *[role=\\"slider\\"][interactive] .interactive\\\\:hidden {
        display: none
    }"
  `);
});

it('should apply prefix to slider variants', async () => {
  const content = sliderAttributes.map((name) => `slider-${name}:hidden`).join(' ');
  const css = await run(content, { sliderPrefix: 'slider' });
  expect(css).toMatchInlineSnapshot(`
    "media-player *[role=\\"slider\\"][dragging] .slider-dragging\\\\:hidden {
        display: none
    }
    media-player *[role=\\"slider\\"][pointing] .slider-pointing\\\\:hidden {
        display: none
    }
    media-player *[role=\\"slider\\"][interactive] .slider-interactive\\\\:hidden {
        display: none
    }"
  `);
});
