import {
  walkComponentDocs,
  type ComponentMeta,
  type EventMeta,
  type MethodMeta,
  type PropMeta,
} from '@maverick-js/compiler/analyze';
import { encode } from 'html-entities';
import elements from 'vidstack/elements.json';

import { getTagNameFromPath } from '$lib/stores/element';

const findRE = /`(.*?)`/g;
const replace = (_, c) => `<code>${encode(c)}</code>`;

export async function loadComponentAPI(pathname: string): Promise<ComponentApi> {
  let tagName = getTagNameFromPath(pathname);
  const component = elements.components.find((component) => component.tag.name === tagName)!;

  if (!component) return {};

  walkComponentDocs(component, (docs) => docs.replace(findRE, replace));

  return {
    props: extractProps(component),
    events: extractEvents(component),
    slots: extractSlots(component),
    cssVars: extractCssVars(component),
    cssParts: extractCssParts(component),
    instanceProps: extractInstanceProps(component),
    instanceMethods: extractInstanceMethods(component),
  };
}

function extractProps(component: ComponentMeta) {
  return component.props
    ?.filter((prop) => !prop.internal)
    .map((prop) => ({
      attr: prop.attribute,
      name: prop.name,
      docs: prop.docs,
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

function extractSlots(component: ComponentMeta) {
  return component.slots?.map((slot) => ({
    name: slot.name || 'DEFAULT',
    docs: slot.docs,
  }));
}

function extractCssVars(component: ComponentMeta) {
  return component.cssvars?.map((prop) => ({
    name: prop.name,
    docs: prop.docs,
    type: prop.type,
    readonly: prop.readonly,
  }));
}

function extractCssParts(component: ComponentMeta) {
  return component.cssparts?.map((part) => ({
    name: part.name,
    docs: part.docs,
  }));
}

function extractInstanceProps(component: ComponentMeta) {
  if (!component.members) return;
  return component.members.props
    ?.filter((prop) => !prop.internal)
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
    attr?: string;
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
  slots?: {
    name: string;
    docs?: string;
  }[];
  cssVars?: {
    name: string;
    docs?: string;
    type?: string;
    readonly?: boolean;
  }[];
  cssParts?: {
    name: string;
    docs?: string;
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
