import { effect, onDispose, peek, signal, type ReadSignal } from 'maverick.js';
import { noop } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { getRequestCredentials } from '../../../utils/network';

const cache = new Map<string, VTTCue[]>(),
  pending = new Set<string>(),
  registry = new Set<ThumbnailsLoader>();

export class ThumbnailsLoader {
  readonly $cues = signal<VTTCue[]>([]);

  static create(src: ReadSignal<string>) {
    const media = useMediaContext();
    return new ThumbnailsLoader(src, media);
  }

  constructor(
    readonly $src: ReadSignal<string>,
    private _media: MediaContext,
  ) {
    effect(this._onLoadCues.bind(this));

    registry.add(this);
    onDispose(() => registry.delete(this));
  }

  protected _onLoadCues() {
    const { canLoad } = this._media.$state;

    if (!canLoad()) return;

    const controller = new AbortController(),
      { crossorigin } = this._media.$state;

    const src = this.$src();
    if (!src) return;

    if (cache.has(src)) {
      // Really basic LRU cache implementation.
      const cues = cache.get(src)!;
      cache.delete(src);
      cache.set(src, cues);

      if (cache.size > 30) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      this.$cues.set(cache.get(src)!);
    } else if (!pending.has(src)) {
      pending.add(src);
      import('media-captions').then(({ parseResponse }) => {
        parseResponse(
          fetch(src, {
            signal: controller.signal,
            credentials: getRequestCredentials(crossorigin()),
          }),
        )
          .then(({ cues }) => {
            this.$cues.set(cues);

            for (const t of registry) {
              if (peek(t.$src) === src) t.$cues.set(cues);
            }

            cache.set(src, cues);
            pending.delete(src);
          })
          .catch(noop);
      });
    }

    return () => {
      controller.abort();
      this.$cues.set([]);
    };
  }
}
