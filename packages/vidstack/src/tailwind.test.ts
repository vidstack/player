import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import path from 'path';

import vidstackPlugin from '../tailwind.cjs';

async function run(content: string) {
  return postcss([
    tailwindcss({
      content: [{ raw: content }],
      corePlugins: { preflight: false },
      plugins: [vidstackPlugin],
    }),
  ]).process(['@tailwind components;', '@tailwind utilities;'].join('\n'), {
    from: `${path.resolve(__filename)}?test=${'should create media variants'}`,
  }).css;
}

it('should create media variants', async () => {
  const content = vidstackPlugin.mediaAttributes
    .map((mediaAttr) => `media-${mediaAttr}:opacity-100`)
    .join(' ');

  const css = await run(content);

  expect(css).toMatchInlineSnapshot(`
    "media-player[autoplay] .media-autoplay\\\\:opacity-100 {
        opacity: 1
    }
    media-player[autoplay-error] .media-autoplay-error\\\\:opacity-100 {
        opacity: 1
    }
    media-player[duration] .media-duration\\\\:opacity-100 {
        opacity: 1
    }
    media-player[can-load] .media-can-load\\\\:opacity-100 {
        opacity: 1
    }
    media-player[can-play] .media-can-play\\\\:opacity-100 {
        opacity: 1
    }
    media-player[can-fullscreen] .media-can-fullscreen\\\\:opacity-100 {
        opacity: 1
    }
    media-player[ended] .media-ended\\\\:opacity-100 {
        opacity: 1
    }
    media-player[error] .media-error\\\\:opacity-100 {
        opacity: 1
    }
    media-player[fullscreen] .media-fullscreen\\\\:opacity-100 {
        opacity: 1
    }
    media-player[user-idle] .media-user-idle\\\\:opacity-100 {
        opacity: 1
    }
    media-player[loop] .media-loop\\\\:opacity-100 {
        opacity: 1
    }
    media-player[muted] .media-muted\\\\:opacity-100 {
        opacity: 1
    }
    media-player[paused] .media-paused\\\\:opacity-100 {
        opacity: 1
    }
    media-player[playing] .media-playing\\\\:opacity-100 {
        opacity: 1
    }
    media-player[playsinline] .media-playsinline\\\\:opacity-100 {
        opacity: 1
    }
    media-player[seeking] .media-seeking\\\\:opacity-100 {
        opacity: 1
    }
    media-player[started] .media-started\\\\:opacity-100 {
        opacity: 1
    }
    media-player[waiting] .media-waiting\\\\:opacity-100 {
        opacity: 1
    }"
  `);
});

it('should create slider variants', async () => {
  const content = vidstackPlugin.sliderAttributes
    .map((sliderAttr) => `${sliderAttr}:opacity-100`)
    .join(' ');

  const css = await run(content);

  expect(css).toMatchInlineSnapshot(`
    "media-player *[dragging] .dragging\\\\:opacity-100 {
        opacity: 1
    }
    media-player *[pointing] .pointing\\\\:opacity-100 {
        opacity: 1
    }
    media-player *[interactive] .interactive\\\\:opacity-100 {
        opacity: 1
    }"
  `);
});
