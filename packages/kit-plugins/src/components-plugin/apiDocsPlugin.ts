import type { ComponentMeta, EventMeta, MethodMeta, PropMeta } from '@vidstack/eliza';
import { camelToKebabCase, kebabToPascalCase } from '@vidstack/foundation';
import LRUCache from 'lru-cache';
import type { Plugin } from 'vite';

import { createMarkdownParser } from '../markdown-plugin';
import { getComponentNameFromId } from './utils';

export const PLUGIN_NAME = '@vidstack/component-api-docs' as const;

const cache = new LRUCache<string, string>({ max: 1024 });

export const apiDocsPlugin = (components: ComponentMeta[]): Plugin => {
  let parser;

  return {
    name: PLUGIN_NAME,
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

        const { title: componentTitle, tagName } = getComponentNameFromId(id);
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
        const titlePostfix = isReact ? ' (React)' : '';
        const title = `${componentTitle} API${titlePostfix}`;

        const code = [
          '---',
          `title: ${title}`,
          '---',
          '',
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

function serializeApi(component: ComponentMeta, isReact: boolean) {
  return JSON.stringify({
    properties: extractProps(component),
    methods: extractMethods(component),
    events: extractEvents(component, isReact),
    slots: extractSlots(component),
    cssProps: extractCssProps(component),
    cssParts: extractCssParts(component),
  });
}

function extractProps(component: ComponentMeta) {
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

function extractMethods(component: ComponentMeta) {
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

function extractEvents(component: ComponentMeta, isReact: boolean) {
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

function reactEventName(eventName: string) {
  return `on${kebabToPascalCase(eventName.replace('vds-', ''))}`;
}

function getEventDetail(event: EventMeta) {
  return event.typeInfo.resolved?.match(/<(.*?)>/)?.[1];
}

function extractSlots(component: ComponentMeta) {
  return component.slots.map((slot) => ({
    name: slot.name,
    description: slot.description,
  }));
}

function extractCssParts(component: ComponentMeta) {
  return component.cssParts.map((cssPart) => ({
    name: cssPart.name,
    description: cssPart.description,
  }));
}

function extractCssProps(component: ComponentMeta) {
  return component.cssProps.map((cssProp) => ({
    name: cssProp.name,
    description: cssProp.description,
  }));
}

function findLink(prop: PropMeta | MethodMeta | EventMeta) {
  return (
    // Prioritize MDN links.
    prop.docTags.find((tag) => /(see|link)/.test(tag.name) && /(mozilla|mdn)/.test(tag.text ?? ''))
      ?.text ?? prop.docTags.find((tag) => /(see|link)/.test(tag.name))?.text
  );
}
