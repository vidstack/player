import { writable } from 'svelte/store';

import { browser } from '$app/env';

const LOCAL_STORAGE_KEY = 'vidstack::install-method';

const initValue = () => {
  const savedValue = browser && localStorage[LOCAL_STORAGE_KEY];
  return savedValue ? savedValue : 'npm';
};

export type InstallMethodType = 'npm' | 'cdn';

const store = writable<InstallMethodType>(initValue());

export const installMethod = {
  ...store,
  set(value: InstallMethodType) {
    if (browser) {
      localStorage[LOCAL_STORAGE_KEY] = value;
    }

    store.set(value);
  },
} as const;
