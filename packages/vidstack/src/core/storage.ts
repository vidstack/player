import throttle from 'just-throttle';
import { effect, type ReadSignal } from 'maverick.js';
import { noop } from 'maverick.js/std';

export class MediaStorage {
  private _data!: SavedMediaData;

  constructor(
    private _playerKey: ReadSignal<string | null>,
    private _mediaKey: ReadSignal<string | null>,
  ) {
    effect(this._load.bind(this));
  }

  get playerKey() {
    return this._playerKey();
  }

  get mediaKey() {
    return this._mediaKey();
  }

  get data(): Readonly<SavedMediaData> {
    return this._data;
  }

  set volume(volume: number) {
    this._data.volume = volume;
    this._save();
  }

  set muted(muted: boolean) {
    this._data.muted = muted;
    this._save();
  }

  set time(time: number) {
    this._data.time = time;
    this._saveTime();
  }

  set lang(lang: string | null) {
    this._data.lang = lang;
    this._save();
  }

  set captions(enabled: boolean) {
    this._data.captions = enabled;
    this._save();
  }

  private _load() {
    const playerKey = this._playerKey(),
      mediaKey = this._mediaKey(),
      savedData = playerKey ? localStorage.getItem(playerKey) : null,
      savedTime = mediaKey ? localStorage.getItem(mediaKey) : null;

    this._data = {
      volume: null,
      muted: null,
      lang: null,
      captions: null,
      ...(savedData ? JSON.parse(savedData) : {}),
      time: savedTime ? +savedTime : null,
    };
  }

  private _save() {
    if (__SERVER__) return;

    const playerKey = this._playerKey();
    if (!playerKey) return;

    const data = JSON.stringify({ ...this._data, time: undefined });
    localStorage.setItem(playerKey, data);
  }

  private _saveTime = __SERVER__
    ? noop
    : throttle(() => {
        const mediaKey = this._mediaKey();
        if (!mediaKey) return;
        const data = this._data.time + '';
        localStorage.setItem(mediaKey, data);
      }, 1000);
}

export interface SavedMediaData {
  volume: number | null;
  muted: boolean | null;
  time: number | null;
  lang: string | null;
  captions: boolean | null;
}
