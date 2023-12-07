import type { MediaProviderAdapter, MediaProviderLoader, MediaSrc, MediaType } from 'vidstack';

export class RemotionProviderLoader implements MediaProviderLoader {
  target!: HTMLElement;

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
