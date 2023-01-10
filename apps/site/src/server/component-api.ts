import { getTagNameFromPath } from '$src/stores/element';
import type { ComponentMeta, EventMeta, MethodMeta, PropMeta } from '@vidstack/eliza';
import { camelToKebabCase } from '@vidstack/foundation';
import { escapeHTML } from '@vitebook/core';
import fs from 'fs/promises';
import path from 'path';

const __cwd = process.cwd();
const components: ComponentMeta[] = [];

export async function loadComponentAPI(pathname: string) {
  await readComponents();

  const tagName = getTagNameFromPath(pathname);
  const component = components.find((component) => component.tagName === tagName)!;

  if (!component) return {};

  parseDocs(component);

  return {
    properties: extractProps(component),
    methods: extractMethods(component),
    events: extractEvents(component),
    slots: extractSlots(component),
    cssProps: extractCssProps(component),
    cssParts: extractCssParts(component),
  };
}

async function readComponents() {
  if (components.length > 0) return;
  const elementsPath = path.resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
  const elements = await getJson(elementsPath);
  components.push(...elements.components);
}

async function getJson(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, { encoding: 'utf-8' }));
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

function extractEvents(component: ComponentMeta) {
  return component.events
    .filter((event) => !event.internal)
    .map((event) => ({
      name: event.name,
      description: event.documentation,
      type: event.typeInfo.original,
      link: findLink(event),
      detail: getEventDetail(event),
    }));
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

function parseDocs(component: ComponentMeta) {
  if (!component) return;

  const findRE = /`(.*?)`/g;
  const replace = (_, c) => `<code>${escapeHTML(c)}</code>`;

  for (const key of Object.keys(component)) {
    if (!Array.isArray(component[key])) continue;

    // @ts-expect-error - ignore
    for (const prop of component[key]) {
      for (const d of ['description', 'documentation']) {
        if (prop[d]) {
          prop[d] = prop[d].replace(findRE, replace);
        }
      }
    }
  }
}

export type ComponentApi = {
  properties: {
    name: string;
    description?: string;
    readonly: boolean;
    type: string;
    link?: string;
    attr?: string;
    hasAttr: boolean;
  }[];
  methods: {
    name: string;
    static: boolean;
    description?: string;
    type: string;
    link?: string;
  }[];
  events: {
    name: string;
    description?: string;
    type: string;
    link?: string;
    detail?: string;
  }[];
  slots: {
    name: string;
    description?: string;
  }[];
  cssProps: {
    name: string;
    description?: string;
  }[];
  cssParts: {
    name: string;
    description?: string;
  }[];
};
