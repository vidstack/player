import type { MediaEvents } from '../events';
import type { MediaRequestEvents } from '../request.events';

/**
 * All media events that are dispatched up to a `MediaControllerElement`.
 */
export type MediaControllerEvents = MediaEvents & MediaRequestEvents;
