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

  async load(ctx: MediaContext): Promise<MediaProviderAdapter> {
    return new (await import('./provider')).RemotionProvider(this.target, ctx);
  }
}
