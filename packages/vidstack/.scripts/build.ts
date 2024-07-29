import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as eslexer from 'es-module-lexer';
import { build } from 'esbuild';
import fsExtra from 'fs-extra';

import { copyPkgInfo } from '../../../.scripts/copy-pkg-info.js';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  MODE_CDN = process.argv.includes('--config-cdn'),
  MODE_PLUGINS = process.argv.includes('--config-plugins'),
  MODE_CSS = process.argv.includes('--config-css');

const NPM_EXTERNAL_PACKAGES = [
    'hls.js',
    'dashjs',
    'media-captions',
    'media-icons',
    'media-icons/element',
    /^@floating-ui/,
    /^lit-html/,
  ],
  CDN_EXTERNAL_PACKAGES = ['media-captions', 'media-icons', 'media-icons/element'],
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', /webpack/, /rspack/, 'esbuild', 'unplugin'];
