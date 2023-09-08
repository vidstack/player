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
  expect(css).toMatchInlineSnapshot();
});

it('should create _not_ media variants', async () => {
  const content = mediaAttributes.map((name) => `not-media-${name}:hidden`).join(' ');
  const css = await run(content);
  expect(css).toMatchInlineSnapshot();
});
