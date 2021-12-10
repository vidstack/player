import { LitElement } from 'lit';

import { WithMediaPlayer } from './WithMediaPlayer';

export const MEDIA_PLAYER_ELEMENT_TAG_NAME = 'vds-media-player';

/**
 * Media player element responsible for wiring together a media provider and player user interface.
 * Generally more specific players are used, such as `AudioPlayerElement`, `VideoPlayerElement`,
 * etc. However, this element is useful when attempting to wire a custom player up with
 * `@vidstack/elements`.
 *
 * @tagname vds-media-player
 * @slot media - Used to pass in a media element (must be HTML5 spec-compliant).
 * @slot ui - Used to pass in the player user interface.
 */
export class MediaPlayerElement extends WithMediaPlayer(LitElement) {}
