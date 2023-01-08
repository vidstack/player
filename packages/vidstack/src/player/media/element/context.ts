import { createContext, ReadSignal, signal } from 'maverick.js';

import type { MediaElement } from './types';

export const MediaElementContext = createContext<ReadSignal<MediaElement | null>>(() =>
  signal(null),
);
