import type { PageState, PageVisibility, VdsEvent } from '@vidstack/foundation';

import type { MediaProviderElement } from '../provider/index.js';

export type MediaVisibilityEvents = {
  'vds-media-visibility-change': MediaVisibilityChangeEvent;
};

export type MediaVisibilityChange = {
  /**
   * The media provider element for which visibility has changed.
   */
  provider: MediaProviderElement;
  /**
   * Whether media is intersecting the configured viewport on the `MediaVisibilityElement`.
   */
  viewport: { isIntersecting: boolean };
  /**
   * The current page state and visibility.
   */
  page: { state: PageState; visibility: PageVisibility };
};

/**
 * Fired when media visibility changes based on the viewport position or page visibility state.
 *
 * @bubbles
 * @composed
 */
export type MediaVisibilityChangeEvent = VdsEvent<MediaVisibilityChange>;
