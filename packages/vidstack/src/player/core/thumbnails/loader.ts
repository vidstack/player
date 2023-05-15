import { effect } from 'maverick.js';
import { ComponentController } from 'maverick.js/element';
import { noop } from 'maverick.js/std';
import { parseResponse } from 'media-captions';

import { getRequestCredentials } from '../../../utils/network';
import { useMedia, type MediaContext } from '../api/context';
import type { PlayerAPI } from '../player';

export class ThumbnailsLoader extends ComponentController<PlayerAPI> {
  protected _media!: MediaContext;

  protected override onConnect(): void {
    this._media = useMedia();
    effect(this._onLoadCues.bind(this));
  }

  protected _onLoadCues() {
    const { canLoad, thumbnailCues } = this._media.$store;

    if (!canLoad()) return;

    const controller = new AbortController(),
      { crossorigin, thumbnails } = this._media.$store;

    const src = thumbnails();
    if (!src) return;

    parseResponse(
      fetch(src, {
        signal: controller.signal,
        credentials: getRequestCredentials(crossorigin()),
      }),
    )
      .then(({ cues }) => thumbnailCues.set(cues))
      .catch(noop);

    return () => {
      controller.abort();
      thumbnailCues.set([]);
    };
  }
}
