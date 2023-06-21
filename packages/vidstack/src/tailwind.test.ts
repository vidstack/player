import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import path from 'path';

import vidstackPlugin, { type PluginOptions } from '../tailwind.cjs';

const mediaAttributes = [
  'autoplay',
  'autoplay-error',
  'can-load',
  'can-play',
  'can-fullscreen',
  'ended',
  'error',
  'fullscreen',
  'controls',
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
  'buffering',
];

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
    "[data-autoplay] .autoplay\\\\:hidden {
        display: none
    }
    [data-autoplay-error] .autoplay-error\\\\:hidden {
        display: none
    }
    [data-buffering] .buffering\\\\:hidden {
        display: none
    }
    [data-can-fullscreen] .can-fullscreen\\\\:hidden {
        display: none
    }
    [data-can-load] .can-load\\\\:hidden {
        display: none
    }
    [data-can-play] .can-play\\\\:hidden {
        display: none
    }
    [data-ended] .ended\\\\:hidden {
        display: none
    }
    [data-error] .error\\\\:hidden {
        display: none
    }
    [data-fullscreen] .fullscreen\\\\:hidden {
        display: none
    }
    [data-controls] .controls\\\\:hidden {
        display: none
    }
    [data-loop] .loop\\\\:hidden {
        display: none
    }
    [data-live] .live\\\\:hidden {
        display: none
    }
    [data-live-edge] .live-edge\\\\:hidden {
        display: none
    }
    [data-muted] .muted\\\\:hidden {
        display: none
    }
    [data-paused] .paused\\\\:hidden {
        display: none
    }
    [data-playing] .playing\\\\:hidden {
        display: none
    }
    [data-playsinline] .playsinline\\\\:hidden {
        display: none
    }
    [data-seeking] .seeking\\\\:hidden {
        display: none
    }
    [data-started] .started\\\\:hidden {
        display: none
    }
    [data-waiting] .waiting\\\\:hidden {
        display: none
    }"
  `);
});

it('should create _not_ media variants', async () => {
  const content = mediaAttributes.map((name) => `not-${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "[data-media-player]:not([data-autoplay]) .not-autoplay\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-autoplay-error]) .not-autoplay-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-buffering]) .not-buffering\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-fullscreen]) .not-can-fullscreen\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-load]) .not-can-load\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-play]) .not-can-play\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-ended]) .not-ended\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-error]) .not-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-fullscreen]) .not-fullscreen\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-controls]) .not-controls\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-loop]) .not-loop\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live]) .not-live\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live-edge]) .not-live-edge\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-muted]) .not-muted\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-paused]) .not-paused\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playing]) .not-playing\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playsinline]) .not-playsinline\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-seeking]) .not-seeking\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-started]) .not-started\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-waiting]) .not-waiting\\\\:hidden {
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
    "[data-autoplay] .media-autoplay\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-autoplay]) .not-media-autoplay\\\\:hidden {
        display: none
    }
    [data-autoplay-error] .media-autoplay-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-autoplay-error]) .not-media-autoplay-error\\\\:hidden {
        display: none
    }
    [data-buffering] .media-buffering\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-buffering]) .not-media-buffering\\\\:hidden {
        display: none
    }
    [data-can-fullscreen] .media-can-fullscreen\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-fullscreen]) .not-media-can-fullscreen\\\\:hidden {
        display: none
    }
    [data-can-load] .media-can-load\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-load]) .not-media-can-load\\\\:hidden {
        display: none
    }
    [data-can-play] .media-can-play\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-play]) .not-media-can-play\\\\:hidden {
        display: none
    }
    [data-ended] .media-ended\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-ended]) .not-media-ended\\\\:hidden {
        display: none
    }
    [data-error] .media-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-error]) .not-media-error\\\\:hidden {
        display: none
    }
    [data-fullscreen] .media-fullscreen\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-fullscreen]) .not-media-fullscreen\\\\:hidden {
        display: none
    }
    [data-controls] .media-controls\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-controls]) .not-media-controls\\\\:hidden {
        display: none
    }
    [data-loop] .media-loop\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-loop]) .not-media-loop\\\\:hidden {
        display: none
    }
    [data-live] .media-live\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live]) .not-media-live\\\\:hidden {
        display: none
    }
    [data-live-edge] .media-live-edge\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live-edge]) .not-media-live-edge\\\\:hidden {
        display: none
    }
    [data-muted] .media-muted\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-muted]) .not-media-muted\\\\:hidden {
        display: none
    }
    [data-paused] .media-paused\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-paused]) .not-media-paused\\\\:hidden {
        display: none
    }
    [data-playing] .media-playing\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playing]) .not-media-playing\\\\:hidden {
        display: none
    }
    [data-playsinline] .media-playsinline\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playsinline]) .not-media-playsinline\\\\:hidden {
        display: none
    }
    [data-seeking] .media-seeking\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-seeking]) .not-media-seeking\\\\:hidden {
        display: none
    }
    [data-started] .media-started\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-started]) .not-media-started\\\\:hidden {
        display: none
    }
    [data-waiting] .media-waiting\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-waiting]) .not-media-waiting\\\\:hidden {
        display: none
    }"
  `);
});
