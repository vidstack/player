import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * @param {string} reactHTML
 * @param {string[]} tags
 */
export async function ssr(reactHTML, tags) {
  for (const tag of tags) {
    await import(`@vidstack/player/define/${tag}.js`);
  }

  const template = html`${unsafeHTML(reactHTML)}`;
  return trimOuterMarkers(iterableToString(render(template)));
}

function trimOuterMarkers(renderedContent) {
  return renderedContent
    .replace(/^((<!--[^<>]*-->)|(<\?>)|\s)+/, '')
    .replace(/((<!--[^<>]*-->)|(<\?>)|\s)+$/, '');
}

const iterableToString = (iterable) => {
  let s = '';
  for (const i of iterable) s += i;
  return s;
};
