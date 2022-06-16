import path from 'path';
import fs from 'fs';
import { globby, globbySync } from 'globby';
import { readFile, writeFile } from 'fs/promises';

/**
 * @param {{
 *  entry: string[],
 *  external?: (string | RegExp)[],
 *  externalizeDeps?: boolean;
 *  domShim?: boolean;
 *  requireShim?: boolean;
 *  minifyHtml?: RegExp | false;
 *  dev?:boolean;
 *  node?:boolean;
 *  mangle?: boolean;
 *  plugins?: (import('esbuild').Plugin | null | undefined | false)[]
 * }} _
 * @returns {import('esbuild').BuildOptions}
 */
export function commonOptions({
  entry,
  external,
  domShim = false,
  externalizeDeps = false,
  requireShim = false,
  minifyHtml,
  dev = false,
  node = false,
  mangle = false,
  plugins = [],
}) {
  const externals = /** @type {string[]} */ ((external ?? []).filter((e) => typeof e === 'string'));

  const regexExternals = /** @type {RegExp[]} */ (
    (external ?? [])?.filter((e) => e instanceof RegExp)
  );

  return {
    entryPoints: entry.map((glob) => globbySync(glob)).flat(),
    treeShaking: true,
    format: 'esm',
    platform: node ? 'node' : 'browser',
    target: node ? 'node16' : 'esnext',
    external: externalizeDeps ? [...externals, ...getDeps()] : externals,
    write: true,
    banner: { js: node && requireShim ? requireShimCode() : '' },
    logLevel: 'warning',
    chunkNames: 'chunks/[name].[hash]',
    mangleProps: mangle ? /^_/ : undefined,
    reserveProps: mangle ? /^__/ : undefined,
    legalComments: 'none',
    define: {
      __DEV__: dev ? 'true' : 'false',
      __NODE__: node ? 'true' : 'false',
    },
    plugins: /** @type {import('esbuild').Plugin[]}  */ (
      [
        externalizeDepsPlugin({ externals: regexExternals }),
        node && domShimPlugin({ force: domShim }),
        !dev && minifyHtml && minifyHtmlLiteralsPlugin({ filter: minifyHtml }),
        ...plugins,
      ].filter(Boolean)
    ),
  };
}

function getDeps() {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')).toString());
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

function requireShimCode() {
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
 * @param {{ externals: RegExp[]; }} _
 * @returns {import('esbuild').Plugin}
 */
function externalizeDepsPlugin({ externals }) {
  return {
    name: '@vidstack/externalize',
    setup(build) {
      for (const filter of externals) {
        build.onResolve({ filter }, (args) => ({ path: args.path, external: true }));
      }
    },
  };
}

/**
 * @returns {import('esbuild').Plugin}
 */
function domShimPlugin({ force = false }) {
  const windowRE = /window\./g;
  const safeWindowCall = '(typeof window !== "undefined" ? window : null)?.';

  return {
    name: '@vidstack/dom-shim',
    setup(build) {
      const outdir = build.initialOptions.outdir;
      if (!outdir) return;

      let includeShim = false;
      build.onStart(() => {
        includeShim = false;
      });

      build.onResolve({ filter: /^lit/ }, () => {
        includeShim = true;
        return null;
      });

      build.onEnd(async () => {
        if (!includeShim && !force) return;

        const shim = domShimCode();

        const files = await globby(`${outdir}/**/*.js`);
        await Promise.all([
          files.map(async (file) => {
            if (file.endsWith('dom-shim.js')) return;

            const content = await readFile(file, { encoding: 'utf-8' });

            const newContent = content
              .replace(windowRE, safeWindowCall)
              .replace('"use strict";', `"use strict";\n\n${shim}`);

            await writeFile(file, newContent);
          }),
        ]);
      });
    },
  };
}

/**
 * @param {{ filter: RegExp}} _
 * @returns {import('esbuild').Plugin}
 */
function minifyHtmlLiteralsPlugin({ filter }) {
  return {
    name: '@vidstack/minify-html-literals',
    async setup(build) {
      const cache = new Map();
      const { minifyHTMLLiterals } = await import('minify-html-literals');

      build.onLoad({ filter }, async ({ path }) => {
        const input = await readFile(path, 'utf8');
        const cached = cache.get(path);

        if (cached?.input === input) {
          return cached.output;
        } else {
          const result = minifyHTMLLiterals(input) ?? undefined;
          const contents = result && `${result.code}\n//# sourceMappingURL=${result.map?.toUrl()}`;
          const loader = path.match(/tsx?$/) ? 'ts' : 'js';
          const output = result && { contents, loader };
          cache.set(path, { input, output });
          return output;
        }
      });
    },
  };
}

function domShimCode() {
  /**
   * @see https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/dom-shim.ts
   */
  return `if (
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
}`;
}
