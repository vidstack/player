import type { DOMEvent } from 'maverick.js/std';

export type VideoPresentationEvents = {
  'video-presentation-change': VideoPresentationChangeEvent;
};

/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @detail mode
 */
export interface VideoPresentationChangeEvent extends DOMEvent<WebKitPresentationMode> {}
