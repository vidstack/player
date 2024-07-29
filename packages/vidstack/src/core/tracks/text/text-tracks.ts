import debounce from 'just-debounce-it';
import { DOMEvent, isArray } from 'maverick.js/std';

import { List, type ListReadonlyChangeEvent } from '../../../foundation/list/list';
import { ListSymbol } from '../../../foundation/list/symbols';
import type { MediaStorage } from '../../state/media-storage';
import { TextTrackSymbol } from './symbols';
import {
  isTrackCaptionKind,
  TextTrack,
  type TextTrackInit,
  type TextTrackModeChangeEvent,
} from './text-track';

/**
 * @see {@link https://vidstack.io/docs/player/api/text-tracks}
 */
export class TextTrackList extends List<TextTrack, TextTrackListEvents> {
  #canLoad = false;
  #defaults: Record<string, TextTrack | undefined> = {};
  #storage: MediaStorage | null = null;
  #preferredLang: string | null = null;

  /** @internal */
  [TextTrackSymbol.crossOrigin]?: () => string | null;

  constructor() {
    super();
  }

  get selected() {
    const track = this.items.find((t) => t.mode === 'showing' && isTrackCaptionKind(t));
    return track ?? null;
  }

  get selectedIndex() {
    const selected = this.selected;
    return selected ? this.indexOf(selected) : -1;
  }

  get preferredLang() {
    return this.#preferredLang;
  }

  set preferredLang(lang: string | null) {
    this.#preferredLang = lang;
    this.#saveLang(lang);
  }

  add(init: TextTrackInit | TextTrack, trigger?: Event) {
    const isTrack = init instanceof TextTrack,
      track = isTrack ? init : new TextTrack(init),
      kind = init.kind === 'captions' || init.kind === 'subtitles' ? 'captions' : init.kind;

    if (this.#defaults[kind] && init.default) delete init.default;

    track.addEventListener('mode-change', this.#onTrackModeChangeBind);

    this[ListSymbol.add](track, trigger);
    track[TextTrackSymbol.crossOrigin] = this[TextTrackSymbol.crossOrigin];

    if (this.#canLoad) track[TextTrackSymbol.canLoad]();

    if (init.default) this.#defaults[kind] = track;

    this.#selectTracks();

    return this;
  }

  remove(track: TextTrack, trigger?: Event) {
    this.#pendingRemoval = track;
    if (!this.items.includes(track)) return;
    if (track === this.#defaults[track.kind]) delete this.#defaults[track.kind];
    track.mode = 'disabled';
    track[TextTrackSymbol.onModeChange] = null;
    track.removeEventListener('mode-change', this.#onTrackModeChangeBind);
    this[ListSymbol.remove](track, trigger);
    this.#pendingRemoval = null;
    return this;
  }

  clear(trigger?: Event) {
    for (const track of [...this.items]) {
      this.remove(track, trigger);
    }

    return this;
  }

  getByKind(kind: TextTrackKind | TextTrackKind[]): TextTrack[] {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this.items.filter((track) => kinds.includes(track.kind));
  }

  /** @internal */
  [TextTrackSymbol.canLoad]() {
    if (this.#canLoad) return;
    for (const track of this.items) track[TextTrackSymbol.canLoad]();
    this.#canLoad = true;
    this.#selectTracks();
  }

  #selectTracks = debounce(async () => {
    if (!this.#canLoad) return;

    if (!this.#preferredLang && this.#storage) {
      this.#preferredLang = await this.#storage.getLang();
    }

    const showCaptions = await this.#storage?.getCaptions(),
      kinds: (TextTrackKind | TextTrackKind[])[] = [
        ['captions', 'subtitles'],
        'chapters',
        'descriptions',
        'metadata',
      ];

    for (const kind of kinds) {
      const tracks = this.getByKind(kind);
      if (tracks.find((t) => t.mode === 'showing')) continue;

      const preferredTrack = this.#preferredLang
        ? tracks.find((track) => track.language === this.#preferredLang)
        : null;

      const defaultTrack = isArray(kind)
        ? this.#defaults[kind.find((kind) => this.#defaults[kind]) || '']
        : this.#defaults[kind];

      const track = preferredTrack ?? defaultTrack,
        isCaptionsKind = track && isTrackCaptionKind(track);

      if (track && (!isCaptionsKind || showCaptions !== false)) {
        track.mode = 'showing';
        if (isCaptionsKind) this.#saveCaptionsTrack(track);
      }
    }
  }, 300);

  #pendingRemoval: TextTrack | null = null;
  #onTrackModeChangeBind = this.#onTrackModeChange.bind(this);
  #onTrackModeChange(event: TextTrackModeChangeEvent) {
    const track = event.detail;

    // We need to check whether track is being removed to not mistakenly save "disabled" mode change.
    if (this.#storage && isTrackCaptionKind(track) && track !== this.#pendingRemoval) {
      this.#saveCaptionsTrack(track);
    }

    if (track.mode === 'showing') {
      const kinds = isTrackCaptionKind(track) ? ['captions', 'subtitles'] : [track.kind];
      for (const t of this.items) {
        if (t.mode === 'showing' && t != track && kinds.includes(t.kind)) {
          t.mode = 'disabled';
        }
      }
    }

    this.dispatchEvent(
      new DOMEvent<TextTrack>('mode-change', {
        detail: event.detail,
        trigger: event,
      }),
    );
  }

  #saveCaptionsTrack(track: TextTrack) {
    if (track.mode !== 'disabled') {
      this.#saveLang(track.language);
    }
    this.#storage?.setCaptions?.(track.mode === 'showing');
  }

  #saveLang(lang: string | null) {
    this.#storage?.setLang?.((this.#preferredLang = lang));
  }

  setStorage(storage: MediaStorage | null) {
    this.#storage = storage;
  }
}

export interface TextTrackListEvents {
  add: TextTrackAddEvent;
  remove: TextTrackRemoveEvent;
  'mode-change': TextTrackListModeChangeEvent;
  'readonly-change': ListReadonlyChangeEvent;
}

export interface TextTrackListEvent<T> extends DOMEvent<T> {
  target: TextTrackList;
}

/**
 * Fired when a text track has been added to the list.
 *
 * @detail newTrack
 */
export interface TextTrackAddEvent extends TextTrackListEvent<TextTrack> {}

/**
 * Fired when a text track has been removed from the list.
 *
 * @detail removedTrack
 */
export interface TextTrackRemoveEvent extends TextTrackListEvent<TextTrack> {}

/**
 * Fired when the mode of any text track in the list has changed.
 *
 * @detail track
 */
export interface TextTrackListModeChangeEvent extends TextTrackListEvent<TextTrack> {}
