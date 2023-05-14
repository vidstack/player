import { DOMEvent } from 'maverick.js/std';

import type { ListReadonlyChangeEvent } from '../../../foundation/list/list';
import { SelectList, type SelectListItem } from '../../../foundation/list/select-list';
import { LIST_ON_RESET, LIST_ON_USER_SELECT } from '../../../foundation/list/symbols';
import { ENABLE_AUTO_QUALITY, SET_AUTO_QUALITY } from './symbols';

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
   * @see {@link https://vidstack.io/docs/player/core-concepts/quality#switch}
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
  [ENABLE_AUTO_QUALITY]?: () => void;

  /* @internal */
  protected override [LIST_ON_USER_SELECT]() {
    this[SET_AUTO_QUALITY](false);
  }

  /* @internal */
  protected override [LIST_ON_RESET](trigger?: Event) {
    this[SET_AUTO_QUALITY](false, trigger);
  }

  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger?: Event): void {
    if (this.readonly || this._auto || !this[ENABLE_AUTO_QUALITY]) return;
    this[ENABLE_AUTO_QUALITY]();
    this[SET_AUTO_QUALITY](true, trigger);
  }

  /* @internal */
  [SET_AUTO_QUALITY](auto: boolean, trigger?: Event) {
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
  readonly width: number;
  readonly height: number;
  readonly bitrate: number;
  readonly codec: string;
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
 */
export interface VideoQualityAddEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when a video quality has been removed from the list.
 */
export interface VideoQualityRemoveEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when the selected video quality has changed.
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
