import previews from ':virtual/code_previews';
import { derived, writable } from 'svelte/store';

import { cleanPathname } from './path';

const store = writable(previews);

export const codePreviews = derived([cleanPathname, store], ([$pathname, $previews]) =>
  $previews.filter((preview) => $pathname.endsWith(preview.path)),
);

if (import.meta.hot) {
  import.meta.hot.accept('/:virtual/code_previews', (mod) => {
    store.set(mod?.default);
  });
}
