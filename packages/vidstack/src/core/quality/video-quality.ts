import { DOMEvent } from 'maverick.js/std';

import type { ListReadonlyChangeEvent } from '../../foundation/list/list';
import { SelectList, type SelectListItem } from '../../foundation/list/select-list';
import { ListSymbol } from '../../foundation/list/symbols';
import { QualitySymbol } from './symbols';

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/quality#quality-list}
 */
export class VideoQualityList extends SelectList<VideoQuality, VideoQualityListEvents> {
  private _auto = false;

  /**
   * Configures quality switching:
   *
   * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
   * request if any, flush the whole buffer, and fetch fragment matching with current position
   * and requested quality level.
   *
   * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
   * already buffered next fragment.
   *
   * - `load`: Set quality level for next loaded fragment.
   *
   * @see {@link https://www.vidstack.io/docs/player/api/video-quality#switch}
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
   */
  switch: 'current' | 'next' | 'load' = 'current';

  /**
   * Whether automatic quality selection is enabled.
   */
  get auto() {
    return this._auto || this.readonly;
  }

  /* @internal */
  [QualitySymbol._enableAuto]?: (trigger?: Event) => void;

  /* @internal */
  protected override [ListSymbol._onUserSelect]() {
    this[QualitySymbol._setAuto](false);
  }

  /* @internal */
  protected override [ListSymbol._onReset](trigger?: Event) {
    this[QualitySymbol._enableAuto] = undefined;
    this[QualitySymbol._setAuto](false, trigger);
  }

  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger?: Event): void {
    if (this.readonly || this._auto || !this[QualitySymbol._enableAuto]) return;
    this[QualitySymbol._enableAuto]?.(trigger);
    this[QualitySymbol._setAuto](true, trigger);
  }

  indexOf(quality: VideoQuality) {
    return this._items.indexOf(quality);
  }

  getById(id: string) {
    return this._items.find((quality) => quality.id === id);
  }

  getBySrc(src: unknown) {
    return this._items.find((quality) => quality.src === src);
  }

  /* @internal */
  [QualitySymbol._setAuto](auto: boolean, trigger?: Event) {
    if (this._auto === auto) return;
    this._auto = auto;
    this.dispatchEvent(
      new DOMEvent<any>('auto-change', {
        detail: auto,
        trigger,
      }),
    );
  }
}

export interface VideoQuality extends SelectListItem {
  readonly id: string;
  readonly src?: unknown;
  readonly width: number;
  readonly height: number;
  readonly bitrate: number | null;
  readonly codec: string | null;
}

export interface VideoQualityListEvents {
  add: VideoQualityAddEvent;
  remove: VideoQualityRemoveEvent;
  change: VideoQualityChangeEvent;
  'auto-change': VideoQualityAutoChangeEvent;
  'readonly-change': ListReadonlyChangeEvent;
}

export interface VideoQualityListEvent<T> extends DOMEvent<T> {
  target: VideoQualityList;
}

/**
 * Fired when a video quality has been added to the list.
 *
 * @detail newQuality
 */
export interface VideoQualityAddEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when a video quality has been removed from the list.
 *
 * @detail removedQuality
 */
export interface VideoQualityRemoveEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when the selected video quality has changed.
 *
 * @detail change
 */
export interface VideoQualityChangeEvent
  extends VideoQualityListEvent<VideoQualityChangeEventDetail> {}

export interface VideoQualityChangeEventDetail {
  prev: VideoQuality | null;
  current: VideoQuality;
}

/**
 * Fired when auto quality selection is enabled or disabled.
 */
export interface VideoQualityAutoChangeEvent extends VideoQualityListEvent<boolean> {}
