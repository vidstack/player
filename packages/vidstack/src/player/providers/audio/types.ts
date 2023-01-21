import type { HTMLCustomElement } from 'maverick.js/element';

import type { HTMLProviderEvents, HTMLProviderMembers, HTMLProviderProps } from '../html/types';

export interface AudioProviderProps extends HTMLProviderProps {}

export interface AudioProviderEvents extends HTMLProviderEvents {}

export interface AudioProviderMembers extends HTMLProviderMembers {}

/**
 * The `<vds-audio>` component adapts the slotted `<audio>` element to enable loading audio
 * via the HTML Media Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/providers/audio}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @slot - Used to pass in the `<audio>` element.
 * @example
 * ```html
 * <vds-media controls view="audio">
 *   <vds-audio>
 *     <audio
 *       preload="none"
 *       src="https://media-files.vidstack.io/audio.mp3"
 *     ></audio>
 *   </vds-audio>
 * </vds-media>
 * ```
 * @example
 * ```html
 * <vds-media controls view="audio">
 *   <vds-audio>
 *     <audio preload="none">
 *       <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
 *     </audio>
 *   </vds-audio>
 * </vds-media>
 * ```
 */
export interface AudioElement
  extends HTMLCustomElement<AudioProviderProps, AudioProviderEvents>,
    AudioProviderMembers {}
