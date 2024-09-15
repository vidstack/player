import type { DOMEvent } from 'maverick.js/std';

import type { TextTrack } from './text-track';

export interface TextTrackEvents {
  'load-start': TextTrackLoadStartEvent;
  load: TextTrackLoadEvent;
  error: TextTrackErrorEvent;
  'add-cue': TextTrackAddCueEvent;
  'remove-cue': TextTrackRemoveCueEvent;
  'cue-change': TextTrackCueChangeEvent;
  'mode-change': TextTrackModeChangeEvent;
}

export interface TextTrackEvent<T> extends DOMEvent<T> {
  target: TextTrack;
}

/**
 * Fired when the text track begins the loading/parsing process.
 */
export interface TextTrackLoadStartEvent extends TextTrackEvent<void> {}

/**
 * Fired when the text track has finished loading/parsing.
 */
export interface TextTrackLoadEvent extends TextTrackEvent<void> {}

/**
 * Fired when loading or parsing the text track fails.
 */
export interface TextTrackErrorEvent extends TextTrackEvent<Error> {}

/**
 * Fired when a cue is added to the text track.
 */
export interface TextTrackAddCueEvent extends TextTrackEvent<VTTCue> {}

/**
 * Fired when a cue is removed from the text track.
 */
export interface TextTrackRemoveCueEvent extends TextTrackEvent<VTTCue> {}

/**
 * Fired when the active cues for the current text track have changed.
 */
export interface TextTrackCueChangeEvent extends TextTrackEvent<void> {}

/**
 * Fired when the text track mode (showing/hidden/disabled) has changed.
 */
export interface TextTrackModeChangeEvent extends TextTrackEvent<TextTrack> {}
