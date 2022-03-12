import type { MediaEvents } from '../events.js';
import type { MediaRequestEvents } from '../request.events.js';

/**
 * All media events that are dispatched up to a `MediaControllerElement`.
 */
export type MediaControllerEvents = MediaEvents & MediaRequestEvents;
