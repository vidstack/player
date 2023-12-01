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
    "div[data-autoplay] .media-autoplay\\\\:hidden {
        display: none
    }
    div[data-autoplay-error] .media-autoplay-error\\\\:hidden {
        display: none
    }
    div[data-buffering] .media-buffering\\\\:hidden {
        display: none
    }
    div[data-can-fullscreen] .media-can-fullscreen\\\\:hidden {
        display: none
    }
    div[data-can-load] .media-can-load\\\\:hidden {
        display: none
    }
    div[data-can-play] .media-can-play\\\\:hidden {
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
    div[data-controls] .media-controls\\\\:hidden {
        display: none
    }
    div[data-loop] .media-loop\\\\:hidden {
        display: none
    }
    div[data-live] .media-live\\\\:hidden {
        display: none
    }
    div[data-live-edge] .media-live-edge\\\\:hidden {
        display: none
    }
    div[data-muted] .media-muted\\\\:hidden {
        display: none
    }
    div[data-paused] .media-paused\\\\:hidden {
        display: none
    }
    div[data-playing] .media-playing\\\\:hidden {
        display: none
    }
    div[data-playsinline] .media-playsinline\\\\:hidden {
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
    "div:not([data-autoplay]) .not-media-autoplay\\\\:hidden {
        display: none
    }
    div:not([data-autoplay-error]) .not-media-autoplay-error\\\\:hidden {
        display: none
    }
    div:not([data-buffering]) .not-media-buffering\\\\:hidden {
        display: none
    }
    div:not([data-can-fullscreen]) .not-media-can-fullscreen\\\\:hidden {
        display: none
    }
    div:not([data-can-load]) .not-media-can-load\\\\:hidden {
        display: none
    }
    div:not([data-can-play]) .not-media-can-play\\\\:hidden {
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
    div:not([data-controls]) .not-media-controls\\\\:hidden {
        display: none
    }
    div:not([data-loop]) .not-media-loop\\\\:hidden {
        display: none
    }
    div:not([data-live]) .not-media-live\\\\:hidden {
        display: none
    }
    div:not([data-live-edge]) .not-media-live-edge\\\\:hidden {
        display: none
    }
    div:not([data-muted]) .not-media-muted\\\\:hidden {
        display: none
    }
    div:not([data-paused]) .not-media-paused\\\\:hidden {
        display: none
    }
    div:not([data-playing]) .not-media-playing\\\\:hidden {
        display: none
    }
    div:not([data-playsinline]) .not-media-playsinline\\\\:hidden {
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
