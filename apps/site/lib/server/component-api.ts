import {
  walkComponentDocs,
  type AttrsMeta,
  type ComponentMeta,
  type EventMeta,
  type MethodMeta,
  type PropMeta,
} from '@maverick-js/cli/analyze';
import MarkdownIt from 'markdown-it';
import meta from 'vidstack/analyze.json';

import { getTagNameFromPath } from '$lib/stores/element';

const parser = new MarkdownIt({ html: true }),
  parsed = new Set<string>();

export async function loadComponentAPI(pathname: string): Promise<ComponentApi> {
  let tagName = getTagNameFromPath(pathname);

  const element = meta.elements.find((el) => el.tag.name === tagName)!,
    component =
      element.component && meta.components.find((c) => c.name === element.component!.name);

  if (!element || !component) return {};

  if (!parsed.has(tagName)) {
    walkComponentDocs(component, (docs) => {
      return parser.render(docs.trim());
    });

    parsed.add(tagName);
  }

  const props = extractProps(component, element.attrs),
    propsWithAttr =
      element.attrs && props
        ? props.filter((prop) => element.attrs![prop.name].attr).map((prop) => prop.name)
        : [];

  return {
    props,
    events: extractEvents(component),
    instanceProps: extractInstanceProps(component, new Set(propsWithAttr)),
    instanceMethods: extractInstanceMethods(component),
  };
}

function extractProps(component: ComponentMeta, attrs?: AttrsMeta) {
  return component.props
    ?.filter((prop) => !prop.internal)
    .map((prop) => ({
      attr: attrs?.[prop.name].attr,
      name: prop.name,
      docs: prop.docs,
      default: prop.default,
      readonly: prop.readonly,
      type: prop.type,
      link: findLink(prop),
    }));
}

function extractEvents(component: ComponentMeta) {
  return component.events
    ?.filter((event) => !event.internal)
    .map((event) => ({
      name: event.name,
      docs: event.docs,
      type: event.type,
      detail: event.detail,
      link: findLink(event),
    }));
}

function extractInstanceProps(component: ComponentMeta, filter: Set<string>) {
  if (!component.members) return;
  return component.members.props
    ?.filter((prop) => !prop.internal && !filter.has(prop.name))
    .map((prop) => ({
      name: prop.name,
      docs: prop.docs,
      type: prop.type,
      readonly: prop.readonly,
      link: findLink(prop),
    }));
}

function extractInstanceMethods(component: ComponentMeta) {
  if (!component.members) return;
  return component.members.methods
    ?.filter((prop) => !prop.internal)
    .map((prop) => ({
      name: prop.name,
      docs: prop.docs,
      type: prop.signature?.type,
      link: findLink(prop),
    }));
}

function findLink(prop: PropMeta | MethodMeta | EventMeta) {
  // Prioritize MDN links.
  const mdnLink = prop.doctags?.find(
    (tag) => /(see|link)/.test(tag.name) && /(mozilla|mdn)/.test(tag.text ?? ''),
  );
  return mdnLink?.text ?? prop.doctags?.find((tag) => /(see|link)/.test(tag.name))?.text;
}

export type ComponentApi = {
  props?: {
    name: string;
    attr?: string | false;
    docs?: string;
    readonly?: boolean;
    type?: string;
    link?: string;
  }[];
  events?: {
    name: string;
    docs?: string;
    type?: string;
    link?: string;
    detail?: string;
  }[];
  instanceProps?: {
    name: string;
    docs?: string;
    type?: string;
    link?: string;
    readonly?: boolean;
  }[];
  instanceMethods?: {
    name: string;
    docs?: string;
    type?: string;
    link?: string;
  }[];
};
