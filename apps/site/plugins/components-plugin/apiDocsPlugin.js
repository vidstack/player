import { createMarkdownParser } from '@svelteness/kit-docs/node';
import { camelToKebabCase, kebabToPascalCase } from '@vidstack/foundation';
import LRUCache from 'lru-cache';

import { getComponentNameFromId } from './utils.js';

const cache = new LRUCache({ max: 1024 });

/**
 * @param {import('@vidstack/eliza').ComponentMeta[]} components
 * @returns {import('vite').Plugin}
 */
export const apiDocsPlugin = (components) => {
  let parser;

  return {
    name: '@vidstack/component-api-docs',
    enforce: 'pre',
    async configResolved() {
      parser = await createMarkdownParser();
      // Put back default inline code render function.
      parser.renderer.rules.code_inline = (tokens, idx) => {
        const token = tokens[idx];
        return `<code>${token.content}</code>`;
      };
    },
    transform(_, id) {
      if (id.endsWith('api.md')) {
        if (cache.has(id)) return cache.get(id);

        const { tagName } = getComponentNameFromId(id);
        const component = components.find((component) => component.tagName === tagName);

        if (component) {
          Object.keys(component).forEach((key) => {
            if (Array.isArray(component[key])) {
              // @ts-expect-error - ignore
              for (const prop of component[key]) {
                ['description', 'documentation'].forEach((d) => {
                  if (prop[d]) {
                    prop[d] = parser
                      .render(prop[d])
                      .replace(
                        /<code>(.*?)<\/code>/g,
                        (_, c) => `<code>${c.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`,
                      );
                  }
                });
              }
            }
          });
        }

        const isReact = /\/react\/?/.test(id);

        const code = [
          '<script context="module">',
          "  import ComponentApiTable from '$lib/components/markdown/ComponentApiTable.svelte';",
          `  const __api = ${component ? serializeApi(component, isReact) : '{}'};`,
          '</script>',
          '',
          '<ComponentApiTable api={__api} />',
        ].join('\n');

        cache.set(id, code);
        return code;
      }

      return null;
    },
  };
};

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 * @param {boolean} isReact
 */
function serializeApi(component, isReact) {
  return JSON.stringify({
    properties: extractProps(component),
    methods: extractMethods(component),
    events: extractEvents(component, isReact),
    slots: extractSlots(component),
    cssProps: extractCssProps(component),
    cssParts: extractCssParts(component),
  });
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 */
function extractProps(component) {
  return component.props
    .filter((prop) => !prop.internal)
    .map((prop) => ({
      attr: camelToKebabCase(prop.name) !== prop.attribute ? prop.attribute : undefined,
      hasAttr: !!prop.attribute,
      name: prop.name,
      description: prop.documentation,
      readonly: prop.readonly,
      type: prop.typeInfo.original,
      link: findLink(prop),
    }));
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 */
function extractMethods(component) {
  return component.methods
    .filter((method) => !method.internal)
    .map((method) => ({
      name: method.name,
      static: method.static,
      description: method.documentation,
      type: method.typeInfo.signatureText,
      link: findLink(method),
    }));
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 * @param {boolean} isReact
 */
function extractEvents(component, isReact) {
  return component.events
    .filter((event) => !event.internal)
    .map((event) => ({
      name: isReact ? reactEventName(event.name) : event.name,
      description: event.documentation,
      type: event.typeInfo.original,
      link: findLink(event),
      detail: getEventDetail(event),
    }));
}

/**
 * @param {string} eventName
 */
function reactEventName(eventName) {
  return `on${kebabToPascalCase(eventName.replace('vds-', ''))}`;
}

/**
 * @param {import('@vidstack/eliza').EventMeta} event
 */
function getEventDetail(event) {
  return event.typeInfo.resolved?.match(/<(.*?)>/)?.[1];
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 */
function extractSlots(component) {
  return component.slots.map((slot) => ({
    name: slot.name,
    description: slot.description,
  }));
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 */
function extractCssParts(component) {
  return component.cssParts.map((cssPart) => ({
    name: cssPart.name,
    description: cssPart.description,
  }));
}

/**
 * @param {import('@vidstack/eliza').ComponentMeta} component
 */
function extractCssProps(component) {
  return component.cssProps.map((cssProp) => ({
    name: cssProp.name,
    description: cssProp.description,
  }));
}

/**
 * @param {import('@vidstack/eliza').PropMeta |
 *  import('@vidstack/eliza').MethodMeta |
 *  import('@vidstack/eliza').EventMeta
 * } prop
 */
function findLink(prop) {
  return (
    // Prioritize MDN links.
    prop.docTags.find((tag) => /(see|link)/.test(tag.name) && /(mozilla|mdn)/.test(tag.text ?? ''))
      ?.text ?? prop.docTags.find((tag) => /(see|link)/.test(tag.name))?.text
  );
}
