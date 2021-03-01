import { listen } from '@wcom/events';
import { Constructor, UpdatingElement } from 'lit-element';

import { MediaType, PlayerState } from '../player.types';
import {
  ProviderDisconnectEvent,
  ProviderMediaTypeChangeEvent,
  ProviderSrcChangeEvent,
} from '../provider';

export type MediaTypeMixinBase = Constructor<UpdatingElement>;

export type MediaTypeCocktail<T extends MediaTypeMixinBase> = T &
  Constructor<Pick<PlayerState, 'mediaType' | 'isAudio' | 'isVideo'>>;

/**
 * Mixes in properties for checking the current view type, and handles updating the media
 * type when certain provider events are emitted.
 *
 * @param Base - The constructor to mix into.
 */
export function MediaTypeMixin<T extends MediaTypeMixinBase>(
  Base: T,
): MediaTypeCocktail<T> {
  class MediaTypeMixin extends Base {
    protected _mediaType = MediaType.Unknown;

    @listen(ProviderMediaTypeChangeEvent.TYPE)
    protected handleMediaTypeChange(e: ProviderMediaTypeChangeEvent) {
      this._mediaType = e.detail;
    }

    @listen(ProviderSrcChangeEvent.TYPE)
    @listen(ProviderDisconnectEvent.TYPE)
    protected handleMediaTypeReset() {
      this._mediaType = MediaType.Unknown;
    }

    get mediaType(): MediaType {
      return this._mediaType;
    }

    get isAudio(): boolean {
      return this.mediaType === MediaType.Audio;
    }

    get isVideo(): boolean {
      return this.mediaType === MediaType.Video;
    }
  }

  return MediaTypeMixin;
}
