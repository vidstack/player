import type { HTMLCustomElement } from 'maverick.js/element';

import type { HTMLProviderEvents, HTMLProviderMembers, HTMLProviderProps } from '../html/types';

export interface AudioProviderProps extends HTMLProviderProps {}

export interface AudioProviderEvents extends HTMLProviderEvents {}

export interface AudioProviderMembers extends HTMLProviderMembers {}

/**
 * The `<vds-audio>` element adapts the underlying `<audio>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * @slot - Used to pass in the `<audio>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}
 * @example
 * ```html
 * <vds-audio>
 *   <audio
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/audio.mp3"
 *    ></audio>
 * </vds-audio>
 * ```
 * @example
 * ```html
 * <vds-audio>
 *   <audio controls preload="none">
 *     <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mp3" />
 *   </audio>
 * </vds-audio>
 * ```
 */
export interface AudioElement
  extends HTMLCustomElement<AudioProviderProps, AudioProviderEvents>,
    AudioProviderMembers {}
