if (__DEV__) {
  console.warn('[vidstack] dev mode!');
}

// Icons
export * from './icons/types';
export * from './icons/component';

// Foundation
export * from './foundation/list/list';
export * from './foundation/fullscreen/controller';
export * from './foundation/fullscreen/events';
export * from './foundation/logger/events';
export * from './foundation/orientation/controller';
export * from './foundation/orientation/events';
export * from './foundation/orientation/types';
export {
  hasTriggerEvent,
  walkTriggerEventChain,
  findTriggerEvent,
  appendTriggerEvent,
} from 'maverick.js/std';

// Core
export * from './player/core/api/types';
export * from './player/core/player';
export * from './player/core/outlet/outlet';
export * from './player/core/api/events';
export * from './player/core/api/request-events';
export * from './player/core/api/store';
export * from './player/core/time-ranges';
export * from './player/core/api/types';
export { type MediaContext, mediaContext } from './player/core/api/context';
export { type PlayerProps, type MediaStateAccessors } from './player/core/api/player-props';
export { type PlayerEvents } from './player/core/api/player-events';
export { type PlayerCSSVars } from './player/core/api/player-cssvars';
export { MediaRemoteControl } from './player/core/state/remote-control';
export { MediaUserController } from './player/core/user';
export * from './player/core/tracks/text/render/text-renderer';
export * from './player/core/tracks/text/render/libass-text-renderer';
export * from './player/core/tracks/text/text-track';
export * from './player/core/tracks/text/text-tracks';
export * from './player/core/tracks/audio-tracks';
export * from './player/core/quality/video-quality';

// Providers
export {
  type MediaProvider,
  type MediaSetupContext,
  type MediaFullscreenAdapter,
  type MediaProviderLoader,
} from './player/core/providers/types';
export { type AudioProvider } from './player/core/providers/audio/provider';
export { type VideoProvider } from './player/core/providers/video/provider';
export { type HLSProvider } from './player/core/providers/hls/provider';
export * from './player/core/providers/video/presentation/events';
export * from './player/core/providers/hls/events';
export * from './player/core/providers/hls/types';
export * from './player/core/providers/type-check';

// Keyboard
export * from './player/core/keyboard/types';
export { MEDIA_KEY_SHORTCUTS } from './player/core/keyboard/controller';

// Buttons
export * from './player/ui/tooltip/tooltip';
export * from './player/ui/buttons/toggle-button';
export * from './player/ui/buttons/play-button';
export * from './player/ui/buttons/caption-button';
export * from './player/ui/buttons/fullscreen-button';
export * from './player/ui/buttons/mute-button';
export * from './player/ui/buttons/pip-button';
export * from './player/ui/buttons/seek-button';

// Slider
export * from './player/ui/sliders/slider/api/props';
export * from './player/ui/sliders/slider/api/events';
export * from './player/ui/sliders/slider/api/cssvars';
export * from './player/ui/sliders/slider/api/store';
export * from './player/ui/sliders/slider/slider';
export * from './player/ui/sliders/slider-thumbnail';
export * from './player/ui/sliders/slider-video';
export * from './player/ui/sliders/slider-value';
export * from './player/ui/sliders/volume-slider';
export * from './player/ui/sliders/time-slider/time-slider';

// Menu
export * from './player/ui/menu/menu';
export * from './player/ui/menu/menu-button';
export * from './player/ui/menu/menu-items';
export * from './player/ui/menu/radio/radio-group';
export * from './player/ui/menu/radio/radio';
export * from './player/ui/menu/chapters-menu-items';
export * from './player/ui/menu/audio/menu-items';
export * from './player/ui/menu/audio/menu-button';
export * from './player/ui/menu/captions/menu-items';
export * from './player/ui/menu/captions/menu-button';
export * from './player/ui/menu/playback-rate/menu-items';
export * from './player/ui/menu/playback-rate/menu-button';
export * from './player/ui/menu/quality/menu-items';
export * from './player/ui/menu/quality/menu-button';

// Media UI
export * from './player/ui/gesture';

// Display
export * from './player/ui/buffering-indicator';
export * from './player/ui/captions/captions';
export * from './player/ui/live-indicator';
export * from './player/ui/poster';
export * from './player/ui/time';
export * from './player/ui/thumbnail';
