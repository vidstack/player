import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  MediaProviderEvents,
  MediaProviderMembers,
  MediaProviderProps,
} from '../../media/provider/types';

export interface HTMLProviderElement
  extends HTMLCustomElement<HTMLProviderProps, HTMLProviderEvents>,
    HTMLProviderMembers {}

export interface HTMLProviderProps extends MediaProviderProps {
  /**
   * Configures the preload setting of the underlying media element once it can load (see
   * `loading` property). This will overwrite any existing `preload` value on the `<audio>`
   * or `<video>` element.
   *
   * The `preload` attribute provides a hint to the browser about what the author thinks will
   * lead to the best user experience with regards to what content is loaded before the video is
   * played. The recommended default is `metadata`.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload}
   */
  preload: 'none' | 'metadata' | 'auto';
}

export interface HTMLProviderEvents extends MediaProviderEvents {}

export interface HTMLProviderMembers extends HTMLProviderProps, MediaProviderMembers {
  readonly mediaElement: HTMLMediaElement | null;
}
