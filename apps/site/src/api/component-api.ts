import type { EventMeta, MethodMeta, PropMeta } from '@maverick-js/cli/analyze';
import reactMeta from '@vidstack/react/analyze.json';
import MarkdownIt from 'markdown-it';
import meta from 'vidstack/analyze.json';

const parser = new MarkdownIt({ html: true }),
  parsed = new Set<string>();

export const reactComponents = reactMeta.react.map((api) => {
  // find instance
  // extend props from instance
  // extend callbacks from instance
  // data attrs??
  // find instance

  return {
    ...api,
  };
});

export const webComponents = meta.elements.map((el) => {
  // find instance
  // props / events / (instance props / instance methods)

  // if (!parsed.has(tagName)) {
  //   walkComponentDocs(component, (docs) => {
  //     return parser.render(docs.trim());
  //   });

  //   parsed.add(tagName);
  // }

  return {};
});

export function findLink(prop: PropMeta | MethodMeta | EventMeta) {
  // Prioritize MDN links.
  const mdnLink = prop.doctags?.find(
    (tag) => /(see|link)/.test(tag.name) && /(mozilla|mdn)/.test(tag.text ?? ''),
  );

  return mdnLink?.text ?? prop.doctags?.find((tag) => /(see|link)/.test(tag.name))?.text;
}
