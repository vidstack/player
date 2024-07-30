import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

const EXTERNAL_PACKAGES = [
    'hls.js',
    'dashjs',
    'media-captions',
    'media-icons',
    'media-icons/element',
    /^@floating-ui/,
    /^lit-html/,
  ],
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', /webpack/, /rspack/, 'esbuild', 'unplugin'];

export default defineConfig(getBundles());

function getBundles() {
  return getTypesBundles();
}

/**
 * @returns {import('rollup').RollupOptions[]}
 * */
function getTypesBundles() {
  /** @type {Record<string, string>} */
  const input = {
    index: 'types/index.d.ts',
    elements: 'types/elements/index.d.ts',
    'global/player': 'types/global/player.d.ts',
    'global/plyr': 'types/global/plyr.d.ts',
    icons: 'types/elements/bundles/icons.d.ts',
  };

  return [
    {
      input,
      output: {
        dir: 'dist-npm',
        chunkFileNames: 'types/vidstack-[hash].d.ts',
        compact: false,
        minifyInternalExports: false,
      },
      external: EXTERNAL_PACKAGES,
      plugins: [
        dts({
          respectExternal: true,
        }),
        {
          name: 'globals',
          generateBundle(_, bundle) {
            const files = new Set(['index.d.ts', 'elements.d.ts']),
              references = ['dom.d.ts', 'google-cast.d.ts']
                .map((path) => `/// <reference path="./${path}" />`)
                .join('\n');

            for (const file of Object.values(bundle)) {
              if (file.type === 'chunk') {
                // Leaking over from lit for some reason.
                file.code = file.code.replace('/// <reference types="trusted-types" />', '');
              }

              if (files.has(file.fileName) && file.type === 'chunk' && file.isEntry) {
                file.code = references + `\n\n${file.code}`;
              }
            }
          },
        },
      ],
    },
    {
      input: 'types/plugins.d.ts',
      output: {
        file: 'dist-npm/plugins.d.ts',
        compact: false,
        minifyInternalExports: false,
      },
      external: PLUGINS_EXTERNAL_PACKAGES,
      plugins: [dts({ respectExternal: true })],
    },
  ];
}
