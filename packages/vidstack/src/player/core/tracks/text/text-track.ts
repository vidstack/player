import { DOMEvent, EventsTarget, isNumber } from 'maverick.js/std';
import {
  type CaptionsFileFormat,
  type CaptionsParserFactory,
  type VTTCue,
  type VTTHeaderMetadata,
  type VTTRegion,
} from 'media-captions';

import { getRequestCredentials } from '../../../../utils/network';
import {
  TEXT_TRACK_CAN_LOAD,
  TEXT_TRACK_CROSSORIGIN,
  TEXT_TRACK_NATIVE,
  TEXT_TRACK_ON_MODE_CHANGE,
  TEXT_TRACK_READY_STATE,
  TEXT_TRACK_UPDATE_ACTIVE_CUES,
} from './symbols';
import { isCueActive } from './utils';

/**
 * - 0: Not Loading
 * - 1: Loading
 * - 2: Ready
 * - 3: Error
 */
export type TextTrackReadyState = 0 | 1 | 2 | 3;

export class TextTrack extends EventsTarget<TextTrackEvents> {
  static createId(track: TextTrack | TextTrackInit) {
    return `id::${track.type}-${track.kind}-${track.src ?? track.label}`;
  }

  readonly src?: string;
  readonly type?: 'json' | CaptionsFileFormat | CaptionsParserFactory;
  readonly encoding?: string;

  readonly id = '';
  readonly label = '';
  readonly language = '';
  readonly kind!: TextTrackKind;
  readonly default = false;

  private _canLoad = false;
  private _currentTime = 0;
  private _mode: TextTrackMode = 'disabled';
  private _metadata: VTTHeaderMetadata = {};
  private _regions: VTTRegion[] = [];
  private _cues: VTTCue[] = [];
  private _activeCues: VTTCue[] = [];

  /* @internal */
  [TEXT_TRACK_READY_STATE]: TextTrackReadyState = 0;

  /* @internal */
  [TEXT_TRACK_CROSSORIGIN]?: () => string | null;

  /* @internal */
  [TEXT_TRACK_ON_MODE_CHANGE]: (() => void) | null = null;

  /* @internal */
  [TEXT_TRACK_NATIVE]: {
    default?: boolean;
    track: {
      mode: TextTrackMode;
      addCue(cue: any): void;
      removeCue(cue: any): void;
    };
    remove?(): void;
  } | null = null;

  get metadata(): Readonly<VTTHeaderMetadata> {
    return this._metadata;
  }

  get regions(): ReadonlyArray<VTTRegion> {
    return this._regions;
  }

  get cues(): ReadonlyArray<VTTCue> {
    return this._cues;
  }

  get activeCues(): ReadonlyArray<VTTCue> {
    return this._activeCues;
  }

  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState(): TextTrackReadyState {
    return this[TEXT_TRACK_READY_STATE];
  }

  get mode(): TextTrackMode {
    return this._mode;
  }

  set mode(mode) {
    this.setMode(mode);
  }

  constructor(init: TextTrackInit) {
    super();

    for (const prop of Object.keys(init)) this[prop] = init[prop];
    if (!init.src) this[TEXT_TRACK_READY_STATE] = 2;

    if (__DEV__ && isTrackCaptionKind(this) && !this.label) {
      throw Error(`[vidstack]: captions text track created without label: \`${this.src}\``);
    }
  }

  addCue(cue: VTTCue, trigger?: Event): void {
    let i = 0,
      length = this._cues.length;

    for (i = 0; i < length; i++) if (cue.endTime <= this._cues[i].startTime) break;

    if (i === length) this._cues.push(cue);
    else this._cues.splice(i, 0, cue);

    // Avoid infinite loop by checking if cue came from native track.
    if (trigger?.type !== 'cuechange') {
      this[TEXT_TRACK_NATIVE]?.track.addCue(cue);
    }

    this.dispatchEvent(new DOMEvent<VTTCue>('add-cue', { detail: cue, trigger }));

    if (isCueActive(cue, this._currentTime)) {
      this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
    }
  }

  removeCue(cue: VTTCue, trigger?: Event): void {
    const index = this._cues.indexOf(cue);
    if (index >= 0) {
      const isActive = this._activeCues.includes(cue);
      this._cues.splice(index, 1);
      this[TEXT_TRACK_NATIVE]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent<VTTCue>('remove-cue', { detail: cue, trigger }));
      if (isActive) {
        this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, trigger);
      }
    }
  }

  setMode(mode: TextTrackMode, trigger?: Event) {
    if (this._mode === mode) return;

    this._mode = mode;

    if (mode === 'disabled') {
      this._activeCues = [];
      this._activeCuesChanged();
    } else {
      this._load();
    }

    this.dispatchEvent(new DOMEvent<TextTrack>('mode-change', { detail: this, trigger }));
    this[TEXT_TRACK_ON_MODE_CHANGE]?.();
  }

  /* @internal */
  [TEXT_TRACK_UPDATE_ACTIVE_CUES](currentTime: number, trigger?: Event) {
    this._currentTime = currentTime;
    if (this.mode === 'disabled' || !this._cues.length) return;

    const activeCues: VTTCue[] = [];

    for (let i = 0, length = this._cues.length; i < length; i++) {
      const cue = this._cues[i]!;
      if (isCueActive(cue, currentTime)) activeCues.push(cue);
    }

    let changed = activeCues.length !== this._activeCues.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this._activeCues.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }

    this._activeCues = activeCues;
    if (changed) this._activeCuesChanged(trigger);
  }

  /* @internal */
  [TEXT_TRACK_CAN_LOAD]() {
    this._canLoad = true;
    if (this._mode !== 'disabled') this._load();
  }

  private async _load() {
    if (!this._canLoad || !this.src || this[TEXT_TRACK_READY_STATE] > 0) return;

    this[TEXT_TRACK_READY_STATE] = 1;
    this.dispatchEvent(new DOMEvent<void>('load-start'));

    try {
      const { parseResponse, VTTCue, VTTRegion } = await import('media-captions'),
        crossorigin = this[TEXT_TRACK_CROSSORIGIN]?.();

      const response = fetch(this.src, {
        headers: this.type === 'json' ? { 'Content-Type': 'application/json' } : undefined,
        credentials: getRequestCredentials(crossorigin),
      });

      if (this.type === 'json') {
        try {
          const json = (await (await response).json()) as {
            regions?: Partial<VTTRegion>[];
            cues?: Partial<VTTCue>[];
          };

          if (json.regions) {
            this._regions = json.regions.map((json) => Object.assign(new VTTRegion(), json));
          }

          if (json.cues) {
            this._cues = json.cues
              .filter((json) => isNumber(json.startTime) && isNumber(json.endTime))
              .map((json) => Object.assign(new VTTCue(0, 0, ''), json));
          }
        } catch (e) {
          if (__DEV__) {
            console.error(`[vidstack] failed to parse JSON captions at: \`${this.src}\`\n\n`, e);
          }
        }
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding,
        });

        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this._metadata = metadata;
          this._regions = regions;
          this._cues = cues;
        }
      }

      this[TEXT_TRACK_READY_STATE] = 2;
      const nativeTrack = this[TEXT_TRACK_NATIVE]?.track;
      if (nativeTrack) for (const cue of this._cues) nativeTrack.addCue(cue);
      const loadEvent = new DOMEvent<void>('load');
      this[TEXT_TRACK_UPDATE_ACTIVE_CUES](this._currentTime, loadEvent);
      this.dispatchEvent(loadEvent);
    } catch (error) {
      this[TEXT_TRACK_READY_STATE] = 3;
      this.dispatchEvent(new DOMEvent('error', { detail: error }));
    }
  }

  private _activeCuesChanged(trigger?: Event) {
    this.dispatchEvent(new DOMEvent<void>('cue-change', { trigger }));
  }
}

export interface TextTrackInit {
  /**
   * URL of the text track resource. This attribute must be specified and its URL value must have
   * the same origin as the document — unless the <audio> or <video> parent element of the track
   * element has a `crossorigin` attribute.
   */
  src?: string;
  /**
   * The captions file format to be parsed or a custom parser factory (functions that returns a
   * captions parser). Supported types include: 'vtt', 'srt', 'ssa', 'ass', and 'json'.
   */
  type?: 'json' | CaptionsFileFormat | CaptionsParserFactory;
  /**
   * The text encoding type to be used when decoding data bytes to text.
   *
   * @defaultValue utf-8
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings}
   *
   */
  encoding?: string;
  /**
   * Indicates that the track should be enabled unless the user's preferences indicate that
   * another track is more appropriate. This may only be used on one track element per media
   * element.
   */
  default?: boolean;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/id} */
  id?: string;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/kind} */
  kind: TextTrackKind;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/label} */
  label?: string;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/language} */
  language?: string;
}

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

const captionRE = /captions|subtitles/;
export function isTrackCaptionKind(track: TextTrack): boolean {
  return captionRE.test(track.kind);
}
