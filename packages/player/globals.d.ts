/// <reference types="@vidstack/foundation/globals" />

import type {
  MediaControllerConnectEvent,
  MediaEvents,
  MediaPlayerConnectEvent,
  MediaProviderConnectEvent,
  MediaRequestEvents,
  MediaSyncEvents,
  MediaVisibilityEvents,
} from './types/media';
import type { HlsEvents } from './types/providers/hls';
import type { VideoPresentationEvents } from './types/providers/video';
import type { SliderEvents } from './types/ui/slider';

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
