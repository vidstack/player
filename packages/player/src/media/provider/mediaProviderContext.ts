import { type Context, createContext, writable, type WritableStore } from '@vidstack/foundation';

import { type MediaProviderElement } from './MediaProviderElement';

export type MediaProviderElementContext = Context<WritableStore<MediaProviderElement | undefined>>;

/**
 * Holds a contextual store reference to the media provider element (e.g, `<vds-video>` or
 * `<vds-hls>`, etc.).
 */
export const mediaProviderElementContext: MediaProviderElementContext = createContext(() =>
  writable(undefined),
);
