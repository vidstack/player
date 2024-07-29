import { DOMEvent, EventsTarget, isArray, isNumber, isString } from 'maverick.js/std';
import type {
  CaptionsFileFormat,
  CaptionsParserFactory,
  VTTCue,
  VTTHeaderMetadata,
  VTTRegion,
} from 'media-captions';

import { getRequestCredentials } from '../../../utils/network';
import { TextTrackSymbol } from './symbols';
import { isCueActive } from './utils';

/**
 * - 0: Not Loading
 * - 1: Loading
 * - 2: Ready
 * - 3: Error
 */
export type TextTrackReadyState = 0 | 1 | 2 | 3;

export interface VTTCueInit
  extends Omit<Partial<VTTCue>, 'startTime' | 'endTime' | 'text'>,
    Pick<VTTCue, 'startTime' | 'endTime' | 'text'> {}

export interface VTTRegionInit extends Omit<Partial<VTTRegion>, 'id'>, Pick<VTTRegion, 'id'> {}

export interface VTTContent {
  cues?: VTTCueInit[];
  regions?: VTTRegionInit[];
}

export class TextTrack extends EventsTarget<TextTrackEvents> {
  static createId(track: TextTrack | TextTrackInit) {
    return `vds-${track.type}-${track.kind}-${track.src ?? track.label ?? '?'}`;
  }

  readonly src?: string;
  readonly content?: TextTrackInit['content'];
  readonly type?: 'json' | CaptionsFileFormat | CaptionsParserFactory;
  readonly encoding?: string;

  readonly id = '';
  readonly label = '';
  readonly language = '';
  readonly kind!: TextTrackKind;
  readonly default = false;

  #canLoad = false;
  #currentTime = 0;
  #mode: TextTrackMode = 'disabled';
  #metadata: VTTHeaderMetadata = {};
  #regions: VTTRegion[] = [];
  #cues: VTTCue[] = [];
  #activeCues: VTTCue[] = [];

  /** @internal */
  [TextTrackSymbol.readyState]: TextTrackReadyState = 0;

  /** @internal */
  [TextTrackSymbol.crossOrigin]?: () => string | null;

  /** @internal */
  [TextTrackSymbol.onModeChange]: (() => void) | null = null;

  /** @internal */
  [TextTrackSymbol.native]: {
    default?: boolean;
    managed?: boolean;
    track: {
      mode: TextTrackMode;
      addCue(cue: any): void;
      removeCue(cue: any): void;
    };
    remove?(): void;
  } | null = null;

  get metadata(): Readonly<VTTHeaderMetadata> {
    return this.#metadata;
  }

  get regions(): ReadonlyArray<VTTRegion> {
    return this.#regions;
  }

  get cues(): ReadonlyArray<VTTCue> {
    return this.#cues;
  }

  get activeCues(): ReadonlyArray<VTTCue> {
    return this.#activeCues;
  }

  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState(): TextTrackReadyState {
    return this[TextTrackSymbol.readyState];
  }

  get mode(): TextTrackMode {
    return this.#mode;
  }

  set mode(mode) {
    this.setMode(mode);
  }

  constructor(init: TextTrackInit) {
    super();

    for (const prop of Object.keys(init)) this[prop] = init[prop];
    if (!this.type) this.type = 'vtt';

    if (!__SERVER__ && init.content) {
      this.#parseContent(init);
    } else if (!init.src) {
      this[TextTrackSymbol.readyState] = 2;
    }

    if (__DEV__ && isTrackCaptionKind(this) && !this.label) {
      console.warn(`[vidstack] captions text track created without label: \`${this.src}\``);
    }
  }

  addCue(cue: VTTCue, trigger?: Event): void {
    let i = 0,
      length = this.#cues.length;

    for (i = 0; i < length; i++) if (cue.endTime <= this.#cues[i].startTime) break;

    if (i === length) this.#cues.push(cue);
    else this.#cues.splice(i, 0, cue);

    // Avoid infinite loop by adding native text track cues back.
    if (!(cue instanceof TextTrackCue)) {
      this[TextTrackSymbol.native]?.track.addCue(cue);
    }

    this.dispatchEvent(new DOMEvent<VTTCue>('add-cue', { detail: cue, trigger }));

    if (isCueActive(cue, this.#currentTime)) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    }
  }

  removeCue(cue: VTTCue, trigger?: Event): void {
    const index = this.#cues.indexOf(cue);
    if (index >= 0) {
      const isActive = this.#activeCues.includes(cue);
      this.#cues.splice(index, 1);
      this[TextTrackSymbol.native]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent<VTTCue>('remove-cue', { detail: cue, trigger }));
      if (isActive) {
        this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
      }
    }
  }

  setMode(mode: TextTrackMode, trigger?: Event) {
    if (this.#mode === mode) return;

    this.#mode = mode;

    if (mode === 'disabled') {
      this.#activeCues = [];
      this.#activeCuesChanged();
    } else if (this.readyState === 2) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    } else {
      this.#load();
    }

    this.dispatchEvent(new DOMEvent<TextTrack>('mode-change', { detail: this, trigger }));
    this[TextTrackSymbol.onModeChange]?.();
  }

  /** @internal */
  [TextTrackSymbol.updateActiveCues](currentTime: number, trigger?: Event) {
    this.#currentTime = currentTime;
    if (this.mode === 'disabled' || !this.#cues.length) return;

    const activeCues: VTTCue[] = [];

    for (let i = 0, length = this.#cues.length; i < length; i++) {
      const cue = this.#cues[i]!;
      if (isCueActive(cue, currentTime)) activeCues.push(cue);
    }

    let changed = activeCues.length !== this.#activeCues.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.#activeCues.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }

    this.#activeCues = activeCues;
    if (changed) this.#activeCuesChanged(trigger);
  }

  /** @internal */
  [TextTrackSymbol.canLoad]() {
    this.#canLoad = true;
    if (this.#mode !== 'disabled') this.#load();
  }

  #parseContent(init: TextTrackInit) {
    import('media-captions').then(({ parseText, VTTCue, VTTRegion }) => {
      if (!isString(init.content) || init.type === 'json') {
        this.#parseJSON(init.content!, VTTCue, VTTRegion);
        if (this.readyState !== 3) this.#ready();
      } else {
        parseText(init.content!, { type: init.type as 'vtt' }).then(({ cues, regions }) => {
          this.#cues = cues;
          this.#regions = regions;
          this.#ready();
        });
      }
    });
  }

  async #load() {
    if (!this.#canLoad || this[TextTrackSymbol.readyState] > 0) return;

    this[TextTrackSymbol.readyState] = 1;
    this.dispatchEvent(new DOMEvent<void>('load-start'));

    if (!this.src) {
      this.#ready();
      return;
    }

    try {
      const { parseResponse, VTTCue, VTTRegion } = await import('media-captions'),
        crossOrigin = this[TextTrackSymbol.crossOrigin]?.();

      const response = fetch(this.src, {
        headers: this.type === 'json' ? { 'Content-Type': 'application/json' } : undefined,
        credentials: getRequestCredentials(crossOrigin),
      });

      if (this.type === 'json') {
        this.#parseJSON(await (await response).text(), VTTCue, VTTRegion);
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding,
        });

        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this.#metadata = metadata;
          this.#regions = regions;
          this.#cues = cues;
        }
      }

      this.#ready();
    } catch (error) {
      this.#error(error);
    }
  }

  #ready() {
    this[TextTrackSymbol.readyState] = 2;

    if (!this.src || this.type !== 'vtt') {
      const native = this[TextTrackSymbol.native];
      if (native && !native.managed) {
        for (const cue of this.#cues) native.track.addCue(cue);
      }
    }

    const loadEvent = new DOMEvent<void>('load');
    this[TextTrackSymbol.updateActiveCues](this.#currentTime, loadEvent);
    this.dispatchEvent(loadEvent);
  }

  #error(error: unknown) {
    this[TextTrackSymbol.readyState] = 3;
    this.dispatchEvent(new DOMEvent('error', { detail: error }));
  }

  #parseJSON(json: string | VTTContent, VTTCue, VTTRegion) {
    try {
      const { regions, cues } = parseJSONCaptionsFile(json, VTTCue, VTTRegion);
      this.#regions = regions;
      this.#cues = cues;
    } catch (error) {
      if (__DEV__) {
        console.error(`[vidstack] failed to parse JSON captions at: \`${this.src}\`\n\n`, error);
      }

      this.#error(error);
    }
  }

  #activeCuesChanged(trigger?: Event) {
    this.dispatchEvent(new DOMEvent<void>('cue-change', { trigger }));
  }
}

export interface TextTrackInit {
  /**
   * A unique identifier.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/id}
   */
  id?: string;
  /**
   * URL of the text track resource. This attribute must be specified and its URL value must have
   * the same origin as the document — unless the <audio> or <video> parent element of the track
   * element has a `crossorigin` attribute.
   */
  readonly src?: string;
  /**
   * Used to directly pass in text track file contents.
   */
  readonly content?: string | VTTContent;
  /**
   * The captions file format to be parsed or a custom parser factory (functions that returns a
   * captions parser). Supported types include: 'vtt', 'srt', 'ssa', 'ass', and 'json'.
   *
   * @defaultValue 'vtt'
   */
  readonly type?: 'json' | CaptionsFileFormat | CaptionsParserFactory;
  /**
   * The text encoding type to be used when decoding data bytes to text.
   *
   * @defaultValue 'utf-8'
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings}
   *
   */
  readonly encoding?: string;
  /**
   * Indicates that the track should be enabled unless the user's preferences indicate that
   * another track is more appropriate. This may only be used on one track element per media
   * element.
   *
   * @defaultValue false
   */
  default?: boolean;
  /**
   * The kind of text track this object represents. This decides how the track will be handled
   * by the player.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/kind}
   */
  readonly kind: TextTrackKind;
  /**
   * A human-readable label for the text track. This will be displayed to the user.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/label}
   */
  readonly label?: string;
  /**
   * A string containing a language identifier. For example, `"en-US"` for United States English
   * or `"pt-BR"` for Brazilian Portuguese.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/language}
   * @see {@link https://datatracker.ietf.org/doc/html/rfc5646}
   */
  readonly language?: string;
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

export function parseJSONCaptionsFile(
  json: string | VTTContent,
  Cue: typeof VTTCue,
  Region?: typeof VTTRegion,
) {
  const content = isString(json) ? JSON.parse(json) : json;

  let regions: VTTRegion[] = [],
    cues: VTTCue[] = [];

  if (content.regions && Region) {
    regions = content.regions.map((region) => Object.assign(new Region(), region));
  }

  if (content.cues || isArray(content)) {
    cues = (isArray(content) ? content : content.cues)
      .filter((content) => isNumber(content.startTime) && isNumber(content.endTime))
      .map((cue) => Object.assign(new Cue(0, 0, ''), cue));
  }

  return { regions, cues };
}
