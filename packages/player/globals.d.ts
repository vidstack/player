/// <reference types="@vidstack/foundation/globals" />

import type {
  MediaControllerConnectEvent,
  MediaEvents,
  MediaPlayerConnectEvent,
  MediaProviderConnectEvent,
  MediaRequestEvents,
  MediaSyncEvents,
  MediaVisibilityEvents,
} from './src/media';
import type { HlsEvents } from './src/providers/hls';
import type { VideoPresentationEvents } from './src/providers/video';
import type { SliderEvents } from './src/ui/slider';

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
