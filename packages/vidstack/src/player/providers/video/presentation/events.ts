import type { DOMEvent } from 'maverick.js/std';

export type VideoPresentationEvents = {
  'vds-video-presentation-change': VideoPresentationChangeEvent;
};

/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @event
 */
export interface VideoPresentationChangeEvent extends DOMEvent<WebKitPresentationMode> {}
