import type {
  MediaConnectEvent,
  MediaEvents,
  MediaProviderConnectEvent,
  MediaRequestEvents,
  MediaSyncEvents,
  MediaVisibilityEvents,
} from './media';
import type { HlsEvents } from './providers/hls';
import type { VideoPresentationEvents } from './providers/video';
import type { SliderEvents } from './ui/slider';

declare global {
  const __DEV__: true;

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

if (__DEV__) {
  console.warn('`@vidstack/player` is in dev mode. Not recommended for production!');
}

export * from './media';
export * from './providers/audio';
export * from './providers/hls';
export * from './providers/html5';
export * from './providers/video';
export * from './ui';
export {
  appendTriggerEvent,
  findTriggerEvent,
  hasTriggerEvent,
  isHlsjsSupported,
  walkTriggerEventChain,
} from '@vidstack/foundation';
