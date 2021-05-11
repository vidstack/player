import { VdsCustomEvent, VdsEventInit, VdsEvents } from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsMediaRequestEvents {}
}

export interface MediaRequestEvents {
  'mute-request': VdsCustomEvent<void>;
  'unmute-request': VdsCustomEvent<void>;
  'enter-fullscreen-request': VdsCustomEvent<void>;
  'exit-fullscreen-request': VdsCustomEvent<void>;
  'play-request': VdsCustomEvent<void>;
  'pause-request': VdsCustomEvent<void>;
  'seek-request': VdsCustomEvent<number>;
  'seeking-request': VdsCustomEvent<number>;
  'volume-change-request': VdsCustomEvent<number>;
}

export type VdsMediaRequestEvents = VdsEvents<MediaRequestEvents>;

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
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsMuteRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 */
export class VdsUnmuteRequestEvent extends VdsMediaRequestEvent<void> {
  static readonly TYPE = 'vds-unmute-request';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsUnmuteRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting media to enter fullscreen.
 *
 * @bubbles
 * @composed
 */
export class VdsEnterFullscreenRequestEvent extends VdsMediaRequestEvent<void> {
  static readonly TYPE = 'vds-enter-fullscreen-request';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsEnterFullscreenRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting media to exit fullscreen.
 *
 * @bubbles
 * @composed
 */
export class VdsExitFullscreenRequestEvent extends VdsMediaRequestEvent<void> {
  static readonly TYPE = 'vds-exit-fullscreen-request';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsExitFullscreenRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export class VdsPlayRequestEvent extends VdsMediaRequestEvent<void> {
  static readonly TYPE = 'vds-play-request';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsPlayRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 */
export class VdsPauseRequestEvent extends VdsMediaRequestEvent<void> {
  static readonly TYPE = 'vds-pause-request';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsPauseRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @bubbles
 * @composed
 */
export class VdsSeekRequestEvent extends VdsMediaRequestEvent<number> {
  static readonly TYPE = 'vds-seek-request';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSeekRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export class VdsSeekingRequestEvent extends VdsMediaRequestEvent<number> {
  static readonly TYPE = 'vds-seeking-request';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSeekingRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 */
export class VdsVolumeChangeRequestEvent extends VdsMediaRequestEvent<number> {
  static readonly TYPE = 'vds-volume-change-request';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsVolumeChangeRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...(eventInit ?? {}),
    });
  }
}
