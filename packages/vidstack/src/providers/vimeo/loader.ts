import { isString } from 'maverick.js/std';

import type { MediaType, Src } from '../../core';
import type { MediaContext } from '../../core/api/media-context';
import { preconnect } from '../../utils/network';
import type { MediaProviderLoader } from '../types';
import type { VimeoProvider } from './provider';

export class VimeoProviderLoader implements MediaProviderLoader<VimeoProvider> {
  readonly name = 'vimeo';

  target!: HTMLIFrameElement;

  preconnect(): void {
    const connections = [
      'https://i.vimeocdn.com',
      'https://f.vimeocdn.com',
      'https://fresnel.vimeocdn.com',
    ];

    for (const url of connections) {
      preconnect(url);
    }
  }

  canPlay(src: Src): boolean {
    return isString(src.src) && src.type === 'video/vimeo';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(ctx: MediaContext): Promise<VimeoProvider> {
    if (__SERVER__) {
      throw Error('[vidstack] can not load vimeo provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<iframe>` element was not found - did you forget to include media provider?',
      );
    }

    return new (await import('./provider')).VimeoProvider(this.target, ctx);
  }

  async loadPoster(src: Src, ctx: MediaContext, abort: AbortController): Promise<string | null> {
    const { resolveVimeoVideoId, getVimeoVideoInfo } = await import('./utils');

    if (!isString(src.src)) return null;

    const { videoId } = resolveVimeoVideoId(src.src);
    if (videoId) {
      return getVimeoVideoInfo(videoId, abort).then((info) => (info ? info.poster : null));
    }

    return null;
  }
}
