import * as React from 'react';

import type { MediaProviderAdapter, MediaProviderLoader, MediaSrc, MediaType } from 'vidstack';

import * as UI from '../../components/layouts/remotion-ui';

export class RemotionProviderLoader implements MediaProviderLoader {
  target!: HTMLElement;

  constructor() {
    UI.RemotionThumbnail.set(React.lazy(() => import('./ui/thumbnail')));
    UI.RemotionSliderThumbnail.set(React.lazy(() => import('./ui/slider-thumbnail')));
  }

  canPlay(src: MediaSrc): boolean {
    return src.type === 'video/remotion';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(): Promise<MediaProviderAdapter> {
    return new (await import('./provider')).RemotionProvider(this.target);
  }
}
