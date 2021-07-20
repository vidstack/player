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
 * @augments {VideoPresentationEvent<import('../../../foundation/types').WebKitPresentationMode>}
 */
export class VideoPresentationChangeEvent extends VideoPresentationEvent {}
/** @readonly */
VideoPresentationChangeEvent.TYPE = 'vds-video-presentation-change';
