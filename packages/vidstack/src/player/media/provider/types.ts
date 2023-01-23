import type { HTMLCustomElement } from 'maverick.js/element';

import type { MediaAdapter } from '../element/controller/types';
import type { MediaLoopRequestEvent, MediaPlayRequestEvent } from '../request-events';

export interface MediaProviderElement
  extends HTMLCustomElement<MediaProviderProps, MediaProviderEvents>,
    MediaProviderMembers {}

export interface MediaProviderProps {}

export interface MediaProviderEvents {
  /** @internal */
  'media-play-request': MediaPlayRequestEvent;
  /** @internal */
  'media-loop-request': MediaLoopRequestEvent;
}

export interface MediaProviderMembers extends MediaProviderProps {
  /**
   * The media adapter provides a consistent interface with retrieving and updating media state
   * on a media provider. The adapter is used by the media controller to update media state.
   */
  readonly adapter: MediaAdapter;
}
