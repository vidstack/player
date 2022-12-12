import type { DOMEvent } from 'maverick.js/std';

import type { MediaControllerEvents } from '../controller/events';
import type { MediaElement } from './types';

export interface MediaElementEvents extends MediaControllerEvents {
  'vds-media-connect': MediaElementConnectEvent;
}

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaElementConnectEvent extends DOMEvent<MediaElement> {}
