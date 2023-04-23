import { peek, tick } from 'maverick.js';
import { DOMEvent, type InferEventDetail, type InferEventInit } from 'maverick.js/std';

import type { MediaContext } from '../api/context';
import type { MediaEvents } from '../api/events';

export class MediaPlayerDelegate {
  constructor(private _handle: (event: Event) => void, private _media: MediaContext) {}

  _dispatch<Type extends keyof MediaEvents>(
    type: Type,
    ...init: InferEventDetail<MediaEvents[Type]> extends void | undefined | never
      ? [init?: Partial<InferEventInit<MediaEvents[Type]>>]
      : [init: InferEventInit<MediaEvents[Type]>]
  ) {
    if (__SERVER__) return;
    this._handle(new DOMEvent<any>(type, init?.[0]));
  }

  async _ready(
    info: {
      duration: number;
      seekable: TimeRanges;
      buffered: TimeRanges;
    },
    trigger?: Event,
  ) {
    if (__SERVER__) return;

    const { $store, logger } = this._media;

    if (peek($store.canPlay)) return;

    this._dispatch('can-play', { detail: info, trigger });
    tick();

    if (__DEV__) {
      logger
        ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
        .labelledLog('Media Store', { ...$store })
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if ($store.canPlay() && $store.autoplay() && !$store.started()) {
      await this._attemptAutoplay();
    }
  }

  private async _attemptAutoplay() {
    const { player, $store } = this._media;

    $store.autoplaying.set(true);

    try {
      await player!.play();
      this._dispatch('autoplay', { detail: { muted: $store.muted() } });
    } catch (error) {
      this._dispatch('autoplay-fail', {
        detail: {
          muted: $store.muted(),
          error: error as Error,
        },
      });
    } finally {
      $store.autoplaying.set(false);
    }
  }
}
