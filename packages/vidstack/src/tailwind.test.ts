import path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
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
  const content = mediaAttributes.map((name) => `media-${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "[data-autoplay] .media-autoplay\\\\:hidden {
        display: none
    }
    [data-autoplay-error] .media-autoplay-error\\\\:hidden {
        display: none
    }
    [data-buffering] .media-buffering\\\\:hidden {
        display: none
    }
    [data-can-load] .media-can-load\\\\:hidden {
        display: none
    }
    [data-can-play] .media-can-play\\\\:hidden {
        display: none
    }
    [data-ended] .media-ended\\\\:hidden {
        display: none
    }
    [data-error] .media-error\\\\:hidden {
        display: none
    }
    [data-controls] .media-controls\\\\:hidden {
        display: none
    }
    [data-loop] .media-loop\\\\:hidden {
        display: none
    }
    [data-live] .media-live\\\\:hidden {
        display: none
    }
    [data-live-edge] .media-live-edge\\\\:hidden {
        display: none
    }
    [data-muted] .media-muted\\\\:hidden {
        display: none
    }
    [data-paused] .media-paused\\\\:hidden {
        display: none
    }
    [data-playing] .media-playing\\\\:hidden {
        display: none
    }
    [data-playsinline] .media-playsinline\\\\:hidden {
        display: none
    }
    [data-seeking] .media-seeking\\\\:hidden {
        display: none
    }
    [data-started] .media-started\\\\:hidden {
        display: none
    }
    [data-waiting] .media-waiting\\\\:hidden {
        display: none
    }"
  `);
});

it('should create _not_ media variants', async () => {
  const content = mediaAttributes.map((name) => `not-media-${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot(`
    "[data-media-player]:not([data-autoplay]) .not-media-autoplay\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-autoplay-error]) .not-media-autoplay-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-buffering]) .not-media-buffering\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-load]) .not-media-can-load\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-can-play]) .not-media-can-play\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-ended]) .not-media-ended\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-error]) .not-media-error\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-controls]) .not-media-controls\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-loop]) .not-media-loop\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live]) .not-media-live\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-live-edge]) .not-media-live-edge\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-muted]) .not-media-muted\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-paused]) .not-media-paused\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playing]) .not-media-playing\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-playsinline]) .not-media-playsinline\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-seeking]) .not-media-seeking\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-started]) .not-media-started\\\\:hidden {
        display: none
    }
    [data-media-player]:not([data-waiting]) .not-media-waiting\\\\:hidden {
        display: none
    }"
  `);
});
