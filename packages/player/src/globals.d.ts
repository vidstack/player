/// <reference types="@vidstack/foundation/globals" />

import type {
  MediaControllerConnectEvent,
  MediaEvents,
  MediaPlayerConnectEvent,
  MediaProviderConnectEvent,
  MediaRequestEvents,
  MediaSyncEvents,
  MediaVisibilityEvents,
} from './media';
import type { HlsEvents } from './providers/hls';
import type { VideoPresentationEvents } from './providers/video';
import type { SliderEvents } from './ui/slider';

declare global {
  interface GlobalEventHandlersEventMap
    extends HlsEvents,
      MediaEvents,
      MediaRequestEvents,
      MediaVisibilityEvents,
      MediaSyncEvents,
      SliderEvents,
      VideoPresentationEvents {
    'vds-media-player-connect': MediaPlayerConnectEvent;
    'vds-media-controller-connect': MediaControllerConnectEvent;
    'vds-media-provider-connect': MediaProviderConnectEvent;
  }
}
