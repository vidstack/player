import throttle from 'just-throttle';
import type { MaybeStopEffect } from 'maverick.js';

import type { MediaSrc } from '../api/types';

export interface MediaStorage {
  getVolume(): Promise<number | null>;
  setVolume?(volume: number): Promise<void>;

  getMuted(): Promise<boolean | null>;
  setMuted?(muted: boolean): Promise<void>;

  getTime(): Promise<number | null>;
  setTime?(time: number): Promise<void>;

  getLang(): Promise<string | null>;
  setLang?(lang: string | null): Promise<void>;

  getCaptions(): Promise<boolean | null>;
  setCaptions?(captions: boolean): Promise<void>;

  /**
   * Called when the `mediaId` has changed. This method can return a function to be called
   * before the next change.
   *
   * - The `mediaId` is computed from the current source and clip times. It will be `null` if
   * there is no source.
   *
   * - The `playerId` is the string provided to the player `storage` prop (if set), or the `id`
   *   set on the player element, otherwise `undefined`.
   */
  onChange?(src: MediaSrc, mediaId: string | null, playerId?: string): MaybeStopEffect;

  /**
   * Called when storage is being destroyed either because the `storage` property on the player
   * has changed, or the player is being destroyed.
   */
  onDestroy?(): void;
}

export class LocalMediaStorage implements MediaStorage {
  protected playerId = 'vds-player';
  protected mediaId: string | null = null;

  private _data: SavedMediaData = {
    volume: null,
    muted: null,
    time: null,
    lang: null,
    captions: null,
  };

  async getVolume() {
    return this._data.volume;
  }

  async setVolume(volume: number) {
    this._data.volume = volume;
    this.save();
  }

  async getMuted() {
    return this._data.muted;
  }

  async setMuted(muted: boolean) {
    this._data.muted = muted;
    this.save();
  }

  async getTime() {
    return this._data.time;
  }

  async setTime(time: number) {
    this._data.time = time;
    this.saveTime();
  }

  async getLang() {
    return this._data.lang;
  }

  async setLang(lang: string | null) {
    this._data.lang = lang;
    this.save();
  }

  async getCaptions() {
    return this._data.captions;
  }

  async setCaptions(enabled: boolean) {
    this._data.captions = enabled;
    this.save();
  }

  onChange(src: MediaSrc, mediaId: string | null, playerId = 'vds-player') {
    const savedData = playerId ? localStorage.getItem(playerId) : null,
      savedTime = mediaId ? localStorage.getItem(mediaId) : null;

    this.playerId = playerId;
    this.mediaId = mediaId;

    this._data = {
      volume: null,
      muted: null,
      lang: null,
      captions: null,
      ...(savedData ? JSON.parse(savedData) : {}),
      time: savedTime ? +savedTime : null,
    };
  }

  protected save() {
    if (__SERVER__ || !this.playerId) return;
    const data = JSON.stringify({ ...this._data, time: undefined });
    localStorage.setItem(this.playerId, data);
  }

  protected saveTime = throttle(() => {
    if (__SERVER__ || !this.mediaId) return;
    const data = (this._data.time ?? 0).toString();
    localStorage.setItem(this.mediaId, data);
  }, 1000);
}

interface SavedMediaData {
  volume: number | null;
  muted: boolean | null;
  time: number | null;
  lang: string | null;
  captions: boolean | null;
}
