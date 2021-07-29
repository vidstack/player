import { VdsEvent } from '../../../base/events';

export type VideoPresentationEvents = {
  'vds-video-presentation-change': VideoPresentationChangeEvent;
};

/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @event
 */
export type VideoPresentationChangeEvent = VdsEvent<WebKitPresentationMode>;
