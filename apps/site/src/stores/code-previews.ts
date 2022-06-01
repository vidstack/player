import { derived, writable } from 'svelte/store';

import previews from ':virtual/code_previews';

import { simplePathname } from './path';

const store = writable(previews);

export const codePreviews = derived([simplePathname, store], ([$pathname, $previews]) =>
  $previews.filter((preview) => $pathname.endsWith(preview.path)),
);

if (import.meta.hot) {
  import.meta.hot.accept('/:virtual/code_previews', ({ default: previews }) => {
    store.set(previews);
  });
}
