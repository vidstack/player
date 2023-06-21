import { effect } from 'maverick.js';
import { noop } from 'maverick.js/std';

import { getRequestCredentials } from '../../utils/network';
import { type MediaContext } from '../api/media-context';
import { MediaPlayerController } from '../api/player-controller';

export class ThumbnailsLoader extends MediaPlayerController {
  constructor(private _media: MediaContext) {
    super();
  }

  protected override onConnect(): void {
    effect(this._onLoadCues.bind(this));
  }

  protected _onLoadCues() {
    const { canLoad, thumbnailCues } = this._media.$state;

    if (!canLoad()) return;

    const controller = new AbortController(),
      { crossorigin, thumbnails } = this._media.$state;

    const src = thumbnails();
    if (!src) return;

    import('media-captions').then(({ parseResponse }) => {
      parseResponse(
        fetch(src, {
          signal: controller.signal,
          credentials: getRequestCredentials(crossorigin()),
        }),
      )
        .then(({ cues }) => thumbnailCues.set(cues))
        .catch(noop);
    });

    return () => {
      controller.abort();
      thumbnailCues.set([]);
    };
  }
}
