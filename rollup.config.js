import commonjs from '@rollup/plugin-commonjs';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';
import summary from 'rollup-plugin-summary';
import { sync as globSync } from 'fast-glob';
import { terser } from 'rollup-plugin-terser';

const ENTRY_POINTS = globSync('dist/**/*.js');
const OUTPUT_DIR = 'dist-prod';

const EXTERNAL_LIBS = ['lit', 'tslib'];
const RESOLVE_ONLY = ['fscreen'];

const GLOBALS = {
  lit: 'lit',
  tslib: 'tslib'
};

// In CHECKSIZE mode we:
// 1) Don't emit any files.
// 2) Don't include the "//# sourceMappingURL" comment.
const CHECK_SIZE = !!process.env.CHECK_SIZE;

if (CHECK_SIZE) {
  console.warn('*** ⚠️  In check size mode, no output! ***');
}

/**
 * This will prevent Rollup from emitting any output files. Used when we are only checking the
 * size of the library.
 */
const skipBundleOutput = () => ({
  generateBundle(options, bundles) {
    /**
     * Deleting all bundles from this object prevents them from being written.
     *
     * @see https://rollupjs.org/guide/en/#generatebundle.
     */
    for (const name in bundles) {
      delete bundles[name];
    }
  }
});

const PLUGINS = ({ minify = true, devMode = false, nodeResolve = {} }) => [
  minify && minifyHTML(),
  resolve({
    exportConditions: minify ? ['production'] : [],
    ...nodeResolve
  }),
  commonjs(),
  replace({
    include: /env.js$/,
    preventAssignment: false,
    values: {
      'const DEV_MODE = true': `const DEV_MODE = ${String(devMode)}`
    }
  }),
  /**
   * This plugin automatically composes the existing TypeScript -> raw JS sourcemap with the
   * raw JS -> minified JS one that we're generating here.
   */
  sourcemaps(),
  minify &&
    terser({
      compress: {
        drop_console: !devMode,
        passes: 3,
        pure_funcs: !devMode && ['_logger', '_logger.*'],
        unsafe: true
      },
      ecma: 2017,
      module: true
    }),
  renameNodeModules('external'),
  CHECK_SIZE && summary({}),
  CHECK_SIZE && skipBundleOutput()
];

export default [
  {
    input: ENTRY_POINTS,
    output: {
      format: 'esm',
      dir: OUTPUT_DIR,
      preserveModules: true,
      preserveModulesRoot: 'dist',
      sourcemap: !CHECK_SIZE
    },
    external: EXTERNAL_LIBS,
    plugins: PLUGINS({
      devMode: false,
      minify: true,
      nodeResolve: {
        resolveOnly: RESOLVE_ONLY
      }
    }),
    watch: {
      clearScreen: false
    }
  }
];
