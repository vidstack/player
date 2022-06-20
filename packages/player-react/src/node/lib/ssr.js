import '@vidstack/player/shims/install-ssr.js';

import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

async function main() {
  const { html: reactHTML, tagNames } = /** @type {{ html: string; tagNames: string; }} */ (
    process.env
  );

  const tags = JSON.parse(tagNames);

  for (const tag of tags) {
    await import(`@vidstack/player/define/${tag}.js`);
  }

  const template = html`${unsafeHTML(reactHTML)}`;
  const ssrHTML = trimOuterMarkers(iterableToString(render(template)));

  process.stdout.write(JSON.stringify({ html: ssrHTML }));
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

main();
