import snippets from ':code_snippets';
import { readonly, writable } from 'svelte/store';

const store = writable(snippets);

export const codeSnippets = readonly(store);

if (import.meta.hot) {
  import.meta.hot.accept('/:code_snippets', (mod) => {
    store.set(mod?.default);
  });
}
