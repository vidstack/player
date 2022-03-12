import { VdsEvent } from '@vidstack/foundation';

import { MediaVolumeChange } from '../events.js';

export type MediaSyncEvents = {
  'vds-media-volume-sync': MediaVolumeSyncEvent;
};

/**
 * Fired when media volume has been synchronized.
 *
 * @bubbles
 * @composed
 */
export type MediaVolumeSyncEvent = VdsEvent<MediaVolumeChange>;
