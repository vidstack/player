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
 * @see {@link https://vidstack.io/docs/player/core-concepts/text-tracks}
 */
export class TextTrackList extends List<TextTrack, TextTrackListEvents> {
  private _canLoad = false;
  private _defaults: Record<string, TextTrack | undefined> = {};
  private _storage: MediaStorage | null = null;
  private _preferredLang: string | null = null;

  /** @internal */
  [TextTrackSymbol._crossOrigin]?: () => string | null;

  constructor() {
    super();
  }

  get selected() {
    const track = this._items.find((t) => t.mode === 'showing' && isTrackCaptionKind(t));
    return track ?? null;
  }

  get selectedIndex() {
    const selected = this.selected;
    return selected ? this.indexOf(selected) : -1;
  }

  get preferredLang() {
    return this._preferredLang;
  }

  set preferredLang(lang: string | null) {
    this._preferredLang = lang;
    this._saveLang(lang);
  }

  add(init: TextTrackInit | TextTrack, trigger?: Event) {
    const isTrack = init instanceof TextTrack,
      track = isTrack ? init : new TextTrack(init),
      kind = init.kind === 'captions' || init.kind === 'subtitles' ? 'captions' : init.kind;

    if (this._defaults[kind] && init.default) delete init.default;

    track.addEventListener('mode-change', this._onTrackModeChangeBind);

    this[ListSymbol._add](track, trigger);
    track[TextTrackSymbol._crossOrigin] = this[TextTrackSymbol._crossOrigin];

    if (this._canLoad) track[TextTrackSymbol._canLoad]();

    if (init.default) this._defaults[kind] = track;

    this._selectTracks();

    return this;
  }

  remove(track: TextTrack, trigger?: Event) {
    if (!this._items.includes(track)) return;
    if (track === this._defaults[track.kind]) delete this._defaults[track.kind];
    track.mode = 'disabled';
    track[TextTrackSymbol._onModeChange] = null;
    track.removeEventListener('mode-change', this._onTrackModeChangeBind);
    this[ListSymbol._remove](track, trigger);
    return this;
  }

  clear(trigger?: Event) {
    for (const track of [...this._items]) {
      this.remove(track, trigger);
    }

    return this;
  }

  getById(id: string): TextTrack | null {
    return this._items.find((track) => track.id === id) ?? null;
  }

  getByKind(kind: TextTrackKind | TextTrackKind[]): TextTrack[] {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this._items.filter((track) => kinds.includes(track.kind));
  }

  indexOf(track: TextTrack) {
    return this._items.indexOf(track);
  }

  /* @internal */
  [TextTrackSymbol._canLoad]() {
    if (this._canLoad) return;
    for (const track of this._items) track[TextTrackSymbol._canLoad]();
    this._canLoad = true;
    this._selectTracks();
  }

  private _selectTracks = debounce(async () => {
    if (!this._canLoad) return;

    if (!this._preferredLang && this._storage) {
      this._preferredLang = await this._storage.getLang();
    }

    const showCaptions = await this._storage?.getCaptions(),
      kinds: (TextTrackKind | TextTrackKind[])[] = [
        ['captions', 'subtitles'],
        'chapters',
        'descriptions',
        'metadata',
      ];

    for (const kind of kinds) {
      const tracks = this.getByKind(kind);
      if (tracks.find((t) => t.mode === 'showing')) continue;

      const preferredTrack = this._preferredLang
        ? tracks.find((track) => track.language === this._preferredLang)
        : null;

      const defaultTrack = isArray(kind)
        ? this._defaults[kind.find((kind) => this._defaults[kind]) || '']
        : this._defaults[kind];

      const track = preferredTrack ?? defaultTrack,
        isCaptionsKind = track && isTrackCaptionKind(track);

      if (track && (!isCaptionsKind || showCaptions !== false)) {
        track.mode = 'showing';
        if (isCaptionsKind) this._saveCaptionsTrack(track);
      }
    }
  }, 300);

  private _onTrackModeChangeBind = this._onTrackModeChange.bind(this);
  private _onTrackModeChange(event: TextTrackModeChangeEvent) {
    const track = event.detail;

    if (this._storage && isTrackCaptionKind(track) && track.mode !== 'disabled') {
      this._saveCaptionsTrack(track);
    }

    if (track.mode === 'showing') {
      const kinds = isTrackCaptionKind(track) ? ['captions', 'subtitles'] : [track.kind];
      for (const t of this._items) {
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

  private _saveCaptionsTrack(track: TextTrack) {
    this._saveLang(track.language);
    this._storage?.setCaptions?.(track.mode === 'showing');
  }

  private _saveLang(lang: string | null) {
    this._storage?.setLang?.((this._preferredLang = lang));
  }

  setStorage(storage: MediaStorage | null) {
    this._storage = storage;
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
