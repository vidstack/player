import fs from 'fs';
import path from 'path';

/**
 * @returns {import('rollup').Plugin}
 */
export function litNode() {
  const litCodeRE = /Google LLC/;
  const windowRE = /window\./g;
  const safeWindowCall = '(typeof window !== "undefined" ? window : null)?.';

  let includeShim = false;

  return {
    name: 'lit-node',
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        const chunk = bundle[file];

        if (chunk.type === 'chunk' && (chunk.isEntry || litCodeRE.test(chunk.code))) {
          const relativePath = path.relative(path.dirname(chunk.fileName), '.');
          const shimImportPath = relativePath.length > 0 ? relativePath : '.';
          const importCode = `import "${shimImportPath}/dom-shim.js";\n`;
          chunk.code = importCode + chunk.code.replace(windowRE, safeWindowCall);
          includeShim = true;
        }
      }
    },
    writeBundle(options) {
      const outdir = options.dir ?? (options.file && path.dirname(options.file));

      if (outdir && includeShim) {
        const filePath = path.resolve(outdir, 'dom-shim.js');
        fs.writeFileSync(filePath, DOM_SHIM);
      }
    },
  };
}

/**
 * @see https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/dom-shim.ts
 */
var DOM_SHIM = `
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
