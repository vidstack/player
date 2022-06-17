/// <reference types="@vidstack/foundation/globals" />

import type {
  HlsEvents,
  MediaConnectEvent,
  MediaEvents,
  MediaProviderConnectEvent,
  MediaRequestEvents,
  MediaSyncEvents,
  MediaVisibilityEvents,
  SliderEvents,
  VideoPresentationEvents,
} from './index';

declare global {
  interface VdsElementEventMap
    extends HlsEvents,
      MediaEvents,
      MediaRequestEvents,
      MediaVisibilityEvents,
      MediaSyncEvents,
      SliderEvents,
      VideoPresentationEvents {
    'vds-media-connect': MediaConnectEvent;
    'vds-media-provider-connect': MediaProviderConnectEvent;
  }
}

export {};
