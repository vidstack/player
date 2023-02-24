import type { HTMLCustomElement } from 'maverick.js/element';

/**
 * This component displays the current live status of the stream. This includes whether it's
 * live, at the live edge, or not live. In addition, this component is a button during live streams
 * and will skip ahead to the live edge when pressed.
 *
 * 🚨 This component will contain no content, sizing, or role when the current stream is _not_ live.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/live-indicator}
 * @slot live - Used to insert content when media stream is live.
 * @slot live-edge - Used to insert content when media playback is at live edge.
 * @slot not-live - Used to insert content when media stream is not live.
 * @example
 * ```html
 * <media-live-indicator></media-live-indicator>
 * ```
 * @example
 * ```html
 * <media-live-indicator>
 *   <div slot="live"></div>
 *   <div slot="live-edge"></div>
 *   <div slot="not-live"></div>
 * </media-live-indicator>
 * ```
 */
export interface MediaLiveIndicatorElement extends HTMLCustomElement {}
