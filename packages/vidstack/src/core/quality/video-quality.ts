import { DOMEvent } from 'maverick.js/std';

import { SelectList, type SelectListItem } from '../../foundation/list/select-list';
import { ListSymbol } from '../../foundation/list/symbols';
import type { VideoQualityListEvents } from './events';
import { QualitySymbol } from './symbols';

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/video-quality#quality-list}
 */
export class VideoQualityList extends SelectList<VideoQuality, VideoQualityListEvents> {
  #auto = false;

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
    return this.#auto || this.readonly;
  }

  /** @internal */
  [QualitySymbol.enableAuto]?: (trigger?: Event) => void;

  /** @internal */
  protected override [ListSymbol.onUserSelect]() {
    this[QualitySymbol.setAuto](false);
  }

  /** @internal */
  protected override [ListSymbol.onReset](trigger?: Event) {
    this[QualitySymbol.enableAuto] = undefined;
    this[QualitySymbol.setAuto](false, trigger);
  }

  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger?: Event): void {
    if (this.readonly || this.#auto || !this[QualitySymbol.enableAuto]) return;
    this[QualitySymbol.enableAuto]?.(trigger);
    this[QualitySymbol.setAuto](true, trigger);
  }

  getBySrc(src: unknown) {
    return this.items.find((quality) => quality.src === src);
  }

  /** @internal */
  [QualitySymbol.setAuto](auto: boolean, trigger?: Event) {
    if (this.#auto === auto) return;
    this.#auto = auto;
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
