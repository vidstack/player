import path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import vidstackPlayerPlugin from '../tailwind.cjs';

async function run(content: string) {
  return postcss([
    tailwindcss({
      content: [{ raw: content }],
      corePlugins: { preflight: false },
      plugins: [vidstackPlayerPlugin],
    }),
  ]).process(['@tailwind components;', '@tailwind utilities;'].join('\n'), {
    from: `${path.resolve(__filename)}?test=${'should create media variants'}`,
  }).css;
}

it('should create media variants', async () => {
  const content = vidstackPlayerPlugin.mediaAttrs
    .map((mediaAttr) => `media-${mediaAttr}:opacity-100`)
    .join(' ');

  const css = await run(content);

  expect(css).toMatchInlineSnapshot(`
    "vds-media[autoplay] .media-autoplay\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[autoplay-error] .media-autoplay-error\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[duration] .media-duration\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[can-load] .media-can-load\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[can-play] .media-can-play\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[can-fullscreen] .media-can-fullscreen\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[ended] .media-ended\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[error] .media-error\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[fullscreen] .media-fullscreen\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[user-idle] .media-user-idle\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[loop] .media-loop\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[muted] .media-muted\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[paused] .media-paused\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[playing] .media-playing\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[playsinline] .media-playsinline\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[seeking] .media-seeking\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[started] .media-started\\\\:opacity-100 {
        opacity: 1
    }
    vds-media[waiting] .media-waiting\\\\:opacity-100 {
        opacity: 1
    }"
  `);
});

it('should create slider variants', async () => {
  const content = vidstackPlayerPlugin.sliderAttrs
    .map((sliderAttr) => `${sliderAttr}:opacity-100`)
    .join(' ');

  const css = await run(content);

  expect(css).toMatchInlineSnapshot(`
    "vds-media *[dragging] .dragging\\\\:opacity-100 {
        opacity: 1
    }
    vds-media *[pointing] .pointing\\\\:opacity-100 {
        opacity: 1
    }
    vds-media *[interactive] .interactive\\\\:opacity-100 {
        opacity: 1
    }"
  `);
});
