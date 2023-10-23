import { peek, tick } from 'maverick.js';
import { DOMEvent, type InferEventDetail, type InferEventInit } from 'maverick.js/std';

import type { MediaContext } from '../api/media-context';
import type { MediaEvents } from '../api/media-events';

let seenAutoplayWarning = false;

export class MediaPlayerDelegate {
  constructor(
    private _handle: (event: Event) => void,
    private _media: MediaContext,
  ) {}

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

    const { $state, logger } = this._media;

    if (peek($state.canPlay)) return;

    this._dispatch('can-play', { detail: info, trigger });
    tick();

    if (__DEV__) {
      logger
        ?.infoGroup('-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-')
        .labelledLog('Media Store', { ...$state })
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if ($state.canPlay() && $state.autoplay() && !$state.started()) {
      await this._attemptAutoplay(trigger);
    }
  }

  private async _attemptAutoplay(trigger?: Event) {
    const { player, $state } = this._media;

    $state.autoplaying.set(true);

    const attemptEvent = new DOMEvent('autoplay-attempt', {
      detail: { muted: $state.muted() },
      trigger,
    });

    try {
      await player.play(attemptEvent);

      this._dispatch('autoplay', {
        detail: { muted: $state.muted() },
        trigger: attemptEvent,
      });
    } catch (error) {
      if (__DEV__ && !seenAutoplayWarning) {
        const muteMsg = !$state.muted()
          ? ' Attempting with volume muted will most likely resolve the issue.'
          : '';

        this._media.logger
          ?.errorGroup('autoplay request failed')
          .labelledLog(
            'Message',
            `Autoplay was requested but failed most likely due to browser autoplay policies.${muteMsg}`,
          )
          .labelledLog('Trigger Event', trigger)
          .labelledLog('Error', error)
          .labelledLog('See', 'https://developer.chrome.com/blog/autoplay')
          .dispatch();

        seenAutoplayWarning = true;
      }

      this._dispatch('autoplay-fail', {
        detail: {
          muted: $state.muted(),
          error: error as Error,
        },
        trigger: attemptEvent,
      });
    } finally {
      $state.autoplaying.set(false);
    }
  }
}
