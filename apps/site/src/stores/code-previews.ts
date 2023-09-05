import previews from ':code_previews';
import { readonly, writable } from 'svelte/store';

const store = writable(previews);

export const codePreviews = readonly(store);

if (import.meta.hot) {
  import.meta.hot.accept('/:code_previews', (mod) => {
    store.set(mod?.default);
  });
}
