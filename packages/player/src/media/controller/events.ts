import type { MediaEvents } from '../events';
import type { MediaRequestEvents } from '../request.events';

/**
 * All media events that are dispatched up to a media controller.
 */
export type MediaControllerEvents = MediaEvents & MediaRequestEvents;
