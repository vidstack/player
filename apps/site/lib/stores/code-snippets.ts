import snippets from ':virtual/code_snippets';
import { derived, writable } from 'svelte/store';

import { cleanPathname } from './path';

const store = writable(snippets);

export const codeSnippets = derived([cleanPathname, store], ([$pathname, $snippets]) => {
  return $snippets.filter((snippet) => snippet.path === $pathname);
});

if (import.meta.hot) {
  import.meta.hot.accept('/:virtual/code_snippets', (mod) => {
    store.set(mod?.default);
  });
}
