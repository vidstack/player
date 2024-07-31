import path from 'node:path';

import fs from 'fs-extra';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

const EXTERNAL_PACKAGES = [
  'react',
  'react-dom',
  'media-icons',
  'media-captions',
  'hls.js',
  'dashjs',
  /^@floating-ui/,
  /^remotion/,
];

export default defineConfig(defineTypesBundle());

/**
 * @returns {import('rollup').RollupOptions[]}
 * */
function defineTypesBundle() {
  return [
    {
      input: {
        index: 'types/react/src/index.d.ts',
        icons: 'types/react/src/icons.d.ts',
        'player/remotion': 'types/react/src/providers/remotion/index.d.ts',
        'player/layouts/default': 'types/react/src/components/layouts/default/index.d.ts',
        'player/layouts/plyr': 'types/react/src/components/layouts/plyr/index.d.ts',
      },
      output: {
        dir: 'dist-npm',
        compact: false,
        minifyInternalExports: false,
        chunkFileNames: 'types/[name].d.ts',
        manualChunks(id) {
          if (id.includes('react/src')) return 'vidstack-react';
          if (id.includes('vidstack')) return 'vidstack';
        },
      },
      external: EXTERNAL_PACKAGES,
      plugins: [
        {
          name: 'resolve-vidstack-types',
          resolveId(id) {
            if (id === 'vidstack') {
              return 'types/vidstack/src/index.d.ts';
            }

            if (id.startsWith('vidstack/exports')) {
              return id.replace('vidstack/exports', 'types/vidstack/src/exports') + '.d.ts';
            }
          },
        },
        dts({
          respectExternal: true,
        }),
        {
          name: 'globals',
          generateBundle(_, bundle) {
            const indexFile = Object.values(bundle).find((file) => file.fileName === 'index.d.ts'),
              globalFiles = ['dom.d.ts', 'google-cast.d.ts'],
              references = globalFiles
                .map((path) => `/// <reference path="./${path}" />`)
                .join('\n');

            if (!fs.existsSync('dist-npm')) {
              fs.mkdirSync('dist-npm');
            }

            for (const file of globalFiles) {
              fs.copyFileSync(path.resolve(`../vidstack/npm/${file}`), `dist-npm/${file}`);
            }

            if (indexFile?.type === 'chunk') {
              indexFile.code = references + `\n\n${indexFile.code}`;
            }
          },
        },
      ],
    },
  ];
}
