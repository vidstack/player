import { writable } from 'svelte/store';

import { browser } from '$app/env';

const LOCAL_STORAGE_KEY = 'vidstack::framework';

const initValue = () => {
  const savedValue = browser && localStorage[LOCAL_STORAGE_KEY];
  return savedValue ? savedValue : 'html';
};

export type FrameworkType = 'html' | 'react';

const store = writable<FrameworkType>(initValue());

export const framework = {
  ...store,
  set(value: FrameworkType) {
    if (browser) {
      localStorage[LOCAL_STORAGE_KEY] = value;
    }

    store.set(value);
  },
} as const;
