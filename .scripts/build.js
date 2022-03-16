import path from 'path';
import minimist from 'minimist';
import globby from 'fast-glob';
import { build } from 'esbuild';
import kleur from 'kleur';
import { gzipSizeFromFileSync } from 'gzip-size';
import { readFileSync } from 'fs';

const args = minimist(process.argv.slice(2));

if (args.prod) {
  process.env.NODE_ENV = 'production';
}

if (!args.entry) {
  console.error(kleur.red(`\n\n🚨 Missing entry argument \`--entry\`\n\n`));
}

if (!args.outdir) {
  console.error(kleur.red(`\n\n🚨 Missing outdir argument \`--outdir\`\n\n`));
}

const IS_NODE = args.platform === 'node';
const nodeShims = IS_NODE
  ? [args.domshim && domShim(), args.requireshim && requireShim()].filter(Boolean).join('\n')
  : '';

async function main() {
  const entryPoints = (args.entry.includes(',') ? args.entry.split(',') : [args.entry])
    .map((glob) => globby.sync(glob))
    .flat();

  const outdir = path.resolve(process.cwd(), args.outdir);

  let result = await build({
    entryPoints,
    outdir,
    outbase: args.outbase ?? 'src',
    logLevel: args.logLevel ?? 'warning',
    platform: args.platform ?? 'browser',
    format: 'esm',
    target: 'es2020',
    watch: args.watch || args.w,
    splitting: IS_NODE || args.nosplit ? false : true,
    chunkNames: 'chunks/[name].[hash]',
    banner: { js: nodeShims },
    minify: args.minify,
    mangleProps: args.mangle ? /^_/ : undefined,
    reserveProps: args.mangle ? /^__/ : undefined,
    legalComments: 'none',
    sourcemap: args.sourcemap,
    treeShaking: true,
    metafile: args.bundle && !args.watch && !args.w,
    incremental: args.watch || args.w,
    define: { __DEV__: args.prod ? 'false' : 'true', __NODE__: IS_NODE ? 'true' : 'false' },
    bundle: args.bundle,
    external: args.bundle ? [...(args.external?.split(',') ?? [])] : undefined,
    plugins: [
      IS_NODE && {
        name: 'patch-lit-node',
        setup(build) {
          build.onLoad({ filter: /node_modules\/@?lit/ }, async (args) => {
            let contents = readFileSync(args.path).toString();
            contents = contents.replace(
              /window\./g,
              '(typeof window !== "undefined" ? window : null)?.',
            );
            return {
              contents,
              loader: 'js',
            };
          });
        },
      },
    ].filter(Boolean),
  });

  if (args.meta) {
    console.log(kleur.bold(kleur.green('*** SRC ***\n')));

    for (const fileName of Object.keys(result.metafile.outputs)) {
      if (fileName.includes('define/') && !fileName.endsWith('.js.map')) {
        const validateInput = (input) => !/node_modules/.test(input);
        logFileStats(fileName, result.metafile, validateInput);
      }
    }

    console.log(kleur.bold(kleur.green('\n*** NODE_MODULES ***\n')));

    const nodeModuleSize = {};

    for (const fileName of Object.keys(result.metafile.inputs)) {
      if (fileName.startsWith('node_modules')) {
        const id = fileName.match(/node_modules\/(.*?)\//)?.[1];
        const bytes = result.metafile.inputs[fileName].bytes;

        const prevBytes = nodeModuleSize[id]?.bytes ?? 0;
        const prevGzipBytes = nodeModuleSize[id]?.gzipBytes ?? 0;

        nodeModuleSize[id] = {
          bytes: prevBytes + bytes,
          gzipBytes: prevGzipBytes + gzipSizeFromFileSync(path.resolve(process.cwd(), fileName)),
        };
      }
    }

    for (const [moduleId, size] of Object.entries(nodeModuleSize)) {
      const fileNameText = kleur.cyan(moduleId);
      const color = getBytesColor(size.gzipBytes);
      const bytesText = kleur.dim(`(${formatBytes(size.bytes)})`);
      const gzipBytesText = kleur.bold(formatBytes(size.gzipBytes));
      console.log(`- ${fileNameText}: ${kleur[color](gzipBytesText)} ${bytesText}`);
    }

    console.log();
  }
}

function getBytesColor(bytes) {
  return !args.prod ? 'dim' : bytes > 20000 ? 'red' : bytes > 10000 ? 'yellow' : 'white';
}

function logFileStats(fileName, metafile, validateInput) {
  const bytes = calculateSize(fileName, metafile, false, validateInput);
  const gzipBytes = calculateSize(fileName, metafile, true, validateInput);
  const color = getBytesColor(gzipBytes);
  const fileNameText = kleur.cyan(fileName.replace(/dist.*?\/define\//, ''));
  const bytesText = kleur.dim(`(${formatBytes(bytes)})`);
  const gzipBytesText = kleur.bold(kleur[color](formatBytes(gzipBytes)));

  console.log(`- ${fileNameText}: ${gzipBytesText} ${bytesText}`);
}

function calculateSize(fileName, metafile, gzipped = false, validateInput, seen = new Set()) {
  if (seen.has(fileName)) return 0;
  seen.add(fileName);

  const metadata = metafile.outputs[fileName];
  const isValid = Object.keys(metadata.inputs).every(validateInput);

  let bytes = isValid
    ? gzipped
      ? gzipSizeFromFileSync(path.resolve(process.cwd(), fileName))
      : metadata.bytes
    : 0;

  for (const _import of metadata.imports) {
    bytes += calculateSize(_import.path, metafile, gzipped, validateInput, seen);
  }

  return bytes;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function requireShim() {
  return [
    "import __path from 'path';",
    "import { fileURLToPath as __fileURLToPath } from 'url';",
    "import { createRequire as __createRequire } from 'module';",
    'const require = __createRequire(import.meta.url);',
    'var __require = function(x) { return require(x); };',
    '__require.__proto__.resolve = require.resolve;',
    'const __filename = __fileURLToPath(import.meta.url);',
    'const __dirname = __path.dirname(__filename);',
  ].join('\n');
}

/**
 * @see https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/dom-shim.ts
 */
function domShim() {
  return `
if (
  !/test/.test(process.env.NODE_ENV) &&
  !import.meta.env?.TEST &&
  !process.env.NO_DOM_SHIM &&
  globalThis.document === undefined
) {
function getWindow() {
  const attributes = new WeakMap();
  const attributesForElement = (element) => {
    let attrs = attributes.get(element);
    if (!attrs) {
      attributes.set(element, (attrs = new Map()));
    }
    return attrs;
  };
  class Element {}
  class HTMLElement extends Element {
    get attributes() {
      return Array.from(attributesForElement(this)).map(([name, value]) => ({
        name,
        value,
      }));
    }
    setAttribute(name, value) {
      attributesForElement(this).set(name, value);
    }
    removeAttribute(name) {
      attributesForElement(this).delete(name);
    }
    hasAttribute(name) {
      return attributesForElement(this).has(name);
    }
    attachShadow() {
      return { host: this };
    }
    getAttribute(name) {
      const value = attributesForElement(this).get(name);
      return value === undefined ? null : value;
    }
  }
  class ShadowRoot {}
  class Document {
    get adoptedStyleSheets() {
      return [];
    }
    createTreeWalker() {
      return {};
    }
    createTextNode() {
      return {};
    }
    createElement() {
      return {};
    }
  }
  class CSSStyleSheet {
    replace() { }
  }
  class CustomElementRegistry {
    constructor() {
      this.__definitions = new Map();
    }
    define(name, ctor) {
      this.__definitions.set(name, {
        ctor,
        observedAttributes: ctor.observedAttributes ?? [],
      });
    }
    get(name) {
      const definition = this.__definitions.get(name);
      return definition && definition.ctor;
    }
  }
  class CustomEvent {}
  const window = {
    Element,
    HTMLElement,
    Document,
    document: new Document(),
    CSSStyleSheet,
    ShadowRoot,
    CustomElementRegistry,
    customElements: new CustomElementRegistry(),
    CustomEvent,
    btoa(s) {
      return Buffer.from(s, 'binary').toString('base64');
    },
    location: new URL('http://localhost'),
    MutationObserver: class {
      observe() { }
    },
    requestAnimationFrame() { },
  };
  return window;
};

const window = getWindow();
Object.assign(globalThis, window);
}
  `;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
