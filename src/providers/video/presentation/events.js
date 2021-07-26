import { VdsEvent } from '@base/events/index.js';

/**
 * @typedef {{
 *   'vds-video-presentation-change': VideoPresentationChangeEvent;
 * }} VideoPresentationEvents
 */

/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @event
 * @typedef {VdsEvent<WebKitPresentationMode>} VideoPresentationChangeEvent
 */
