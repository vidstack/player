import { VdsCustomEvent } from '../shared/events/index.js';

export class VdsMediaEvent extends VdsCustomEvent {}

export class VdsAbortEvent extends VdsMediaEvent {
  static TYPE = 'vds-abort';
  constructor(eventInit) {
    super(VdsAbortEvent.TYPE, eventInit);
  }
}

export class VdsCanPlayEvent extends VdsMediaEvent {
  static TYPE = 'vds-can-play';
  constructor(eventInit) {
    super(VdsCanPlayEvent.TYPE, eventInit);
  }
}

export class VdsCanPlayThroughEvent extends VdsMediaEvent {
  static TYPE = 'vds-can-play-through';
  constructor(eventInit) {
    super(VdsCanPlayThroughEvent.TYPE, eventInit);
  }
}

export class VdsDurationChangeEvent extends VdsMediaEvent {
  static TYPE = 'vds-duration-change';
  constructor(eventInit) {
    super(VdsDurationChangeEvent.TYPE, eventInit);
  }
}

export class VdsEmptiedEvent extends VdsMediaEvent {
  static TYPE = 'vds-emptied';
  constructor(eventInit) {
    super(VdsEmptiedEvent.TYPE, eventInit);
  }
}

export class VdsEndedEvent extends VdsMediaEvent {
  static TYPE = 'vds-ended';
  constructor(eventInit) {
    super(VdsEndedEvent.TYPE, eventInit);
  }
}

export class VdsErrorEvent extends VdsMediaEvent {
  static TYPE = 'vds-error';
  constructor(eventInit) {
    super(VdsErrorEvent.TYPE, eventInit);
  }
}

export class VdsFullscreenChangeEvent extends VdsMediaEvent {
  static TYPE = 'vds-fullscreen-change';
  constructor(eventInit) {
    super(VdsFullscreenChangeEvent.TYPE, eventInit);
  }
}

export class VdsLoadedDataEvent extends VdsMediaEvent {
  static TYPE = 'vds-loaded-data';
  constructor(eventInit) {
    super(VdsLoadedDataEvent.TYPE, eventInit);
  }
}

export class VdsLoadedMetadataEvent extends VdsMediaEvent {
  static TYPE = 'vds-loaded-metadata';
  constructor(eventInit) {
    super(VdsLoadedMetadataEvent.TYPE, eventInit);
  }
}

export class VdsLoadStartEvent extends VdsMediaEvent {
  static TYPE = 'vds-load-start';
  constructor(eventInit) {
    super(VdsLoadStartEvent.TYPE, eventInit);
  }
}

export class VdsMediaTypeChangeEvent extends VdsMediaEvent {
  static TYPE = 'vds-media-type-change';
  constructor(eventInit) {
    super(VdsMediaTypeChangeEvent.TYPE, eventInit);
  }
}

export class VdsPauseEvent extends VdsMediaEvent {
  static TYPE = 'vds-pause';
  constructor(eventInit) {
    super(VdsPauseEvent.TYPE, eventInit);
  }
}

export class VdsPlayEvent extends VdsMediaEvent {
  static TYPE = 'vds-play';
  constructor(eventInit) {
    super(VdsPlayEvent.TYPE, eventInit);
  }
}

export class VdsPlayingEvent extends VdsMediaEvent {
  static TYPE = 'vds-playing';
  constructor(eventInit) {
    super(VdsPlayingEvent.TYPE, eventInit);
  }
}

export class VdsProgressEvent extends VdsMediaEvent {
  static TYPE = 'vds-progress';
  constructor(eventInit) {
    super(VdsProgressEvent.TYPE, eventInit);
  }
}

export class VdsSeekedEvent extends VdsMediaEvent {
  static TYPE = 'vds-seeked';
  constructor(eventInit) {
    super(VdsSeekedEvent.TYPE, eventInit);
  }
}

export class VdsSeekingEvent extends VdsMediaEvent {
  static TYPE = 'vds-seeking';
  constructor(eventInit) {
    super(VdsSeekingEvent.TYPE, eventInit);
  }
}

export class VdsStalledEvent extends VdsMediaEvent {
  static TYPE = 'vds-stalled';
  constructor(eventInit) {
    super(VdsStalledEvent.TYPE, eventInit);
  }
}

export class VdsStartedEvent extends VdsMediaEvent {
  static TYPE = 'vds-started';
  constructor(eventInit) {
    super(VdsStartedEvent.TYPE, eventInit);
  }
}

export class VdsSuspendEvent extends VdsMediaEvent {
  static TYPE = 'vds-suspend';
  constructor(eventInit) {
    super(VdsSuspendEvent.TYPE, eventInit);
  }
}

export class VdsReplayEvent extends VdsMediaEvent {
  static TYPE = 'vds-replay';
  constructor(eventInit) {
    super(VdsReplayEvent.TYPE, eventInit);
  }
}

export class VdsTimeUpdateEvent extends VdsMediaEvent {
  static TYPE = 'vds-time-update';
  constructor(eventInit) {
    super(VdsTimeUpdateEvent.TYPE, eventInit);
  }
}

export class VdsViewTypeChangeEvent extends VdsMediaEvent {
  static TYPE = 'vds-view-type-change';
  constructor(eventInit) {
    super(VdsViewTypeChangeEvent.TYPE, eventInit);
  }
}

export class VdsVolumeChangeEvent extends VdsMediaEvent {
  static TYPE = 'vds-volume-change';
  constructor(eventInit) {
    super(VdsVolumeChangeEvent.TYPE, eventInit);
  }
}

export class VdsWaitingEvent extends VdsMediaEvent {
  static TYPE = 'vds-waiting';
  constructor(eventInit) {
    super(VdsWaitingEvent.TYPE, eventInit);
  }
}
