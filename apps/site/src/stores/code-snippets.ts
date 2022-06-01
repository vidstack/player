import { derived, writable } from 'svelte/store';

import snippets from ':virtual/code_snippets';

import { simplePathname } from './path';

const store = writable(snippets);

export const codeSnippets = derived([simplePathname, store], ([$pathname, $snippets]) =>
  $snippets.filter((snippet) => $pathname.endsWith(snippet.path)),
);

if (import.meta.hot) {
  import.meta.hot.accept('/:virtual/code_snippets', ({ default: snippets }) => {
    store.set(snippets);
  });
}
