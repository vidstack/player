import { VdsCustomEvent } from '../shared/events/index.js';

export class MediaRequestEvent extends VdsCustomEvent {}

export class MuteRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-mute-request';
  constructor(eventInit) {
    super(MuteRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class UnmuteRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-unmute-request';
  constructor(eventInit) {
    super(UnmuteRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class EnterFullscreenRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-enter-fullscreen-request';
  constructor(eventInit) {
    super(EnterFullscreenRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class ExitFullscreenRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-exit-fullscreen-request';
  constructor(eventInit) {
    super(ExitFullscreenRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class PlayRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-play-request';
  constructor(eventInit) {
    super(PlayRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class PauseRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-pause-request';
  constructor(eventInit) {
    super(PauseRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class SeekRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-seek-request';
  constructor(eventInit) {
    super(SeekRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class SeekingRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-seeking-request';
  constructor(eventInit) {
    super(SeekingRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}

export class VolumeChangeRequestEvent extends MediaRequestEvent {
  static TYPE = 'vds-volume-change-request';
  constructor(eventInit) {
    super(VolumeChangeRequestEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}
