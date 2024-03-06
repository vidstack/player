if (__DEV__) {
  console.warn('[vidstack] dev mode!');
}

// Foundation
export { Logger } from './foundation/logger/controller';
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
  isPointerEvent,
  isKeyboardClick,
  isKeyboardEvent,
} from 'maverick.js/std';
export { getDownloadFile, type FileDownloadInfo } from './utils/network';

// Core
export * from './core';

// Providers
export * from './providers';

// Components
export * from './components';

// Utils
export { formatTime, formatSpokenTime } from './utils/time';
export * from './utils/mime';
export {
  canChangeVolume,
  canOrientScreen,
  canPlayHLSNatively,
  canUsePictureInPicture,
  canUseVideoPresentation,
  canRotateScreen,
} from './utils/support';
