import { VdsCustomEvent } from '../../../foundation/events/index.js';

/**
 * @typedef {{
 *   [VideoPresentationChangeEvent.TYPE]: VideoPresentationChangeEvent;
 * }} VideoPresentationEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class VideoPresentationEvent extends VdsCustomEvent {}

/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @augments {VideoPresentationEvent<WebKitPresentationMode>}
 */
export class VideoPresentationChangeEvent extends VideoPresentationEvent {
  /** @readonly */
  static TYPE = 'vds-video-presentation-change';
}
