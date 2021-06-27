import { VdsCustomEvent } from '../shared/events/index.js';

export class MediaEvent extends VdsCustomEvent {}

export class AbortEvent extends MediaEvent {
  static TYPE = 'vds-abort';
  constructor(eventInit) {
    super(AbortEvent.TYPE, eventInit);
  }
}

export class CanPlayEvent extends MediaEvent {
  static TYPE = 'vds-can-play';
  constructor(eventInit) {
    super(CanPlayEvent.TYPE, eventInit);
  }
}

export class CanPlayThroughEvent extends MediaEvent {
  static TYPE = 'vds-can-play-through';
  constructor(eventInit) {
    super(CanPlayThroughEvent.TYPE, eventInit);
  }
}

export class DurationChangeEvent extends MediaEvent {
  static TYPE = 'vds-duration-change';
  constructor(eventInit) {
    super(DurationChangeEvent.TYPE, eventInit);
  }
}

export class EmptiedEvent extends MediaEvent {
  static TYPE = 'vds-emptied';
  constructor(eventInit) {
    super(EmptiedEvent.TYPE, eventInit);
  }
}

export class EndedEvent extends MediaEvent {
  static TYPE = 'vds-ended';
  constructor(eventInit) {
    super(EndedEvent.TYPE, eventInit);
  }
}

export class ErrorEvent extends MediaEvent {
  static TYPE = 'vds-error';
  constructor(eventInit) {
    super(ErrorEvent.TYPE, eventInit);
  }
}

export class FullscreenChangeEvent extends MediaEvent {
  static TYPE = 'vds-fullscreen-change';
  constructor(eventInit) {
    super(FullscreenChangeEvent.TYPE, eventInit);
  }
}

export class LoadedDataEvent extends MediaEvent {
  static TYPE = 'vds-loaded-data';
  constructor(eventInit) {
    super(LoadedDataEvent.TYPE, eventInit);
  }
}

export class LoadedMetadataEvent extends MediaEvent {
  static TYPE = 'vds-loaded-metadata';
  constructor(eventInit) {
    super(LoadedMetadataEvent.TYPE, eventInit);
  }
}

export class LoadStartEvent extends MediaEvent {
  static TYPE = 'vds-load-start';
  constructor(eventInit) {
    super(LoadStartEvent.TYPE, eventInit);
  }
}

export class MediaTypeChangeEvent extends MediaEvent {
  static TYPE = 'vds-media-type-change';
  constructor(eventInit) {
    super(MediaTypeChangeEvent.TYPE, eventInit);
  }
}

export class PauseEvent extends MediaEvent {
  static TYPE = 'vds-pause';
  constructor(eventInit) {
    super(PauseEvent.TYPE, eventInit);
  }
}

export class PlayEvent extends MediaEvent {
  static TYPE = 'vds-play';
  constructor(eventInit) {
    super(PlayEvent.TYPE, eventInit);
  }
}

export class PlayingEvent extends MediaEvent {
  static TYPE = 'vds-playing';
  constructor(eventInit) {
    super(PlayingEvent.TYPE, eventInit);
  }
}

export class ProgressEvent extends MediaEvent {
  static TYPE = 'vds-progress';
  constructor(eventInit) {
    super(ProgressEvent.TYPE, eventInit);
  }
}

export class SeekedEvent extends MediaEvent {
  static TYPE = 'vds-seeked';
  constructor(eventInit) {
    super(SeekedEvent.TYPE, eventInit);
  }
}

export class SeekingEvent extends MediaEvent {
  static TYPE = 'vds-seeking';
  constructor(eventInit) {
    super(SeekingEvent.TYPE, eventInit);
  }
}

export class StalledEvent extends MediaEvent {
  static TYPE = 'vds-stalled';
  constructor(eventInit) {
    super(StalledEvent.TYPE, eventInit);
  }
}

export class StartedEvent extends MediaEvent {
  static TYPE = 'vds-started';
  constructor(eventInit) {
    super(StartedEvent.TYPE, eventInit);
  }
}

export class SuspendEvent extends MediaEvent {
  static TYPE = 'vds-suspend';
  constructor(eventInit) {
    super(SuspendEvent.TYPE, eventInit);
  }
}

export class ReplayEvent extends MediaEvent {
  static TYPE = 'vds-replay';
  constructor(eventInit) {
    super(ReplayEvent.TYPE, eventInit);
  }
}

export class TimeUpdateEvent extends MediaEvent {
  static TYPE = 'vds-time-update';
  constructor(eventInit) {
    super(TimeUpdateEvent.TYPE, eventInit);
  }
}

export class ViewTypeChangeEvent extends MediaEvent {
  static TYPE = 'vds-view-type-change';
  constructor(eventInit) {
    super(ViewTypeChangeEvent.TYPE, eventInit);
  }
}

export class VolumeChangeEvent extends MediaEvent {
  static TYPE = 'vds-volume-change';
  constructor(eventInit) {
    super(VolumeChangeEvent.TYPE, eventInit);
  }
}

export class WaitingEvent extends MediaEvent {
  static TYPE = 'vds-waiting';
  constructor(eventInit) {
    super(WaitingEvent.TYPE, eventInit);
  }
}
