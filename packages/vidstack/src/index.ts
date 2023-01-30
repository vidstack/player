if (__DEV__) {
  console.warn('[vidstack] dev mode - not recommended for production!');
}

// Foundation
export * from './foundation/fullscreen/events';
export * from './foundation/fullscreen/events';
export * from './foundation/logger/events';
export * from './foundation/orientation/events';
export * from './foundation/orientation/types';
export {
  hasTriggerEvent,
  walkTriggerEventChain,
  findTriggerEvent,
  appendTriggerEvent,
} from 'maverick.js/std';

// Media Player
export * from './player/element/types';
export { MediaContext, mediaContext } from './player/media/context';
export * from './player/media/controller/types';
export * from './player/media/events';
export * from './player/media/types';
export { MediaRemoteControl } from './player/media/remote-control';
export * from './player/media/request-events';
export * from './player/media/state';
export * from './player/media/store';
export * from './player/media/time-ranges';
export * from './player/media/types';
export * from './player/media/outlet/types';

// Media Player Providers
export {
  type MediaProvider,
  type MediaProviderContext,
  type MediaFullscreenAdapter,
  type MediaProviderLoader,
} from './player/media/providers/types';
export * from './player/media/providers/type-check';
export { type AudioProvider } from './player/media/providers/audio/provider';
export { type VideoProvider } from './player/media/providers/video/provider';
export { type HLSProvider } from './player/media/providers/hls/provider';
export * from './player/media/providers/video/presentation/events';
export * from './player/media/providers/hls/events';
export * from './player/media/providers/hls/types';

// Media Player UI
export * from './player/ui/fullscreen-button/types';
export * from './player/ui/play-button/types';
export * from './player/ui/mute-button/types';
export * from './player/ui/poster/types';
export * from './player/ui/slider/types';
export * from './player/ui/slider/events';
export * from './player/ui/slider/store';
export * from './player/ui/slider-value-text/types';
export * from './player/ui/slider-video/types';
export * from './player/ui/time/types';
export * from './player/ui/time-slider/types';
export * from './player/ui/toggle-button/types';
export * from './player/ui/volume-slider/types';

// Media Player Definitions
export { MediaDefinition } from './player/element/element';
export { MediaOutletDefinition } from './player/media/outlet/element';
export { FullscreenButtonDefinition } from './player/ui/fullscreen-button/element';
export { MuteButtonDefinition } from './player/ui/mute-button/element';
export { PlayButtonDefinition } from './player/ui/play-button/element';
export { PosterDefinition } from './player/ui/poster/element';
export { SliderValueTextDefinition } from './player/ui/slider-value-text/element';
export { SliderVideoDefinition } from './player/ui/slider-video/element';
export { TimeSliderDefinition } from './player/ui/time-slider/element';
export { TimeDefinition } from './player/ui/time/element';
export { VolumeSliderDefinition } from './player/ui/volume-slider/element';
