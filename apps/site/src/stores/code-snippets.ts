import snippets from ':code_snippets';
import { readonly, writable } from 'svelte/store';

const store = writable(snippets);

export const codeSnippets = readonly(store);
