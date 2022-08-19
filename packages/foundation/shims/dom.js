// @ts-nocheck

export function getWindow() {
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
    get style() {
      return {
        setProperty(name, value) {
          const attrs = attributesForElement(this);
          let styles = attrs.get('style') ?? '';
          styles += `${name}: ${value};`;
          attrs.set('style', styles);
        },
      };
    }
    addEventListener() {}
    removeEventListener() {}
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
    addEventListener() {}
    removeEventListener() {}
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
    replace() {}
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

  class CustomEvent {
    constructor(type) {
      this.type = type;
    }
  }

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
      observe() {}
    },
    addEventListener() {},
    removeEventListener() {},
    requestAnimationFrame() {},
  };

  return /** @type {any} */ (window);
}
