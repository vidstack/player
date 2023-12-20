import { isString } from 'maverick.js/std';

import type { MediaSrc, MediaType } from '../../core';
import type { MediaContext } from '../../core/api/media-context';
import { preconnect } from '../../utils/network';
import type { MediaProviderLoader } from '../types';
import type { YouTubeProvider } from './provider';

export class YouTubeProviderLoader implements MediaProviderLoader<YouTubeProvider> {
  target!: HTMLIFrameElement;

  preconnect() {
    const connections = [
      // Botguard script.
      'https://www.google.com',
      // Posters.
      'https://i.ytimg.com',
      // Ads.
      'https://googleads.g.doubleclick.net',
      'https://static.doubleclick.net',
    ];

    for (const url of connections) {
      preconnect(url, 'preconnect');
    }
  }

  canPlay(src: MediaSrc): boolean {
    return isString(src.src) && src.type === 'video/youtube';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(ctx: MediaContext): Promise<YouTubeProvider> {
    if (__SERVER__) {
      throw Error('[vidstack] can not load youtube provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<iframe>` element was not found - did you forget to include media provider?',
      );
    }

    return new (await import('./provider')).YouTubeProvider(this.target);
  }

  async loadPoster(
    src: MediaSrc,
    ctx: MediaContext,
    abort: AbortController,
  ): Promise<string | null> {
    const { findYouTubePoster, resolveYouTubeVideoId } = await import('./utils');

    const videoId = isString(src.src) && resolveYouTubeVideoId(src.src);
    if (videoId) return findYouTubePoster(videoId, abort);

    return null;
  }
}
