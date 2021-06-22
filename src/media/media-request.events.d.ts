import { VdsCustomEvent } from '../shared/events/index.js';
import { VdsEventInit } from '../shared/events/index.js';

declare global {
	interface GlobalEventHandlersEventMap extends VdsMediaRequestEvents {}
}

export interface VdsMediaRequestEvents {
	'vds-mute-request': VdsCustomEvent<void>;
	'vds-unmute-request': VdsCustomEvent<void>;
	'vds-enter-fullscreen-request': VdsCustomEvent<void>;
	'vds-exit-fullscreen-request': VdsCustomEvent<void>;
	'vds-play-request': VdsCustomEvent<void>;
	'vds-pause-request': VdsCustomEvent<void>;
	'vds-seek-request': VdsCustomEvent<number>;
	'vds-seeking-request': VdsCustomEvent<number>;
	'vds-volume-change-request': VdsCustomEvent<number>;
}

export class VdsMediaRequestEvent<
	DetailType
> extends VdsCustomEvent<DetailType> {
	static readonly TYPE: keyof VdsMediaRequestEvents;
}

/**
 * Fired when requesting the media to be muted.
 *
 * @bubbles
 * @composed
 */
export class VdsMuteRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-mute-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 */
export class VdsUnmuteRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-unmute-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media to enter fullscreen.
 *
 * @bubbles
 * @composed
 */
export class VdsEnterFullscreenRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-enter-fullscreen-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media to exit fullscreen.
 *
 * @bubbles
 * @composed
 */
export class VdsExitFullscreenRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-exit-fullscreen-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export class VdsPlayRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-play-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 */
export class VdsPauseRequestEvent extends VdsMediaRequestEvent<void> {
	static readonly TYPE = 'vds-pause-request';
	constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @bubbles
 * @composed
 */
export class VdsSeekRequestEvent extends VdsMediaRequestEvent<number> {
	static readonly TYPE = 'vds-seek-request';
	constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export class VdsSeekingRequestEvent extends VdsMediaRequestEvent<number> {
	static readonly TYPE = 'vds-seeking-request';
	constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 */
export class VdsVolumeChangeRequestEvent extends VdsMediaRequestEvent<number> {
	static readonly TYPE = 'vds-volume-change-request';
	constructor(eventInit: VdsEventInit<number>);
}
