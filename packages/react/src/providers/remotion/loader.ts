import * as React from 'react';

import type {
  MediaContext,
  MediaProviderAdapter,
  MediaProviderLoader,
  MediaType,
  Src,
} from 'vidstack';

import * as UI from '../../components/layouts/remotion-ui';

export class RemotionProviderLoader implements MediaProviderLoader {
  readonly name = 'remotion';

  target!: HTMLElement;

  constructor() {
    UI.RemotionThumbnail.set(React.lazy(() => import('./ui/thumbnail')));
    UI.RemotionSliderThumbnail.set(React.lazy(() => import('./ui/slider-thumbnail')));
    UI.RemotionPoster.set(React.lazy(() => import('./ui/poster')));
  }

  canPlay(src: Src): boolean {
    return src.type === 'video/remotion';
  }

  mediaType(): MediaType {
    return 'video';
  }
  async fetch() {
    if (__SERVER__) {
      throw Error('[vidstack] can not load video provider server-side');
    }
    return (await import('./provider')).RemotionProvider;
  }
  async load(ctx: MediaContext): Promise<MediaProviderAdapter> {
    const Provider = await this.fetch();

    return new Provider(this.target, ctx);
  }
}
