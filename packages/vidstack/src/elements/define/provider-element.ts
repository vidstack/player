import { computed, effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { MediaProvider } from '../../components';
import { useMediaContext, type MediaContext } from '../../core/api/media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/core/provider}
 * @example
 * ```html
 * <media-player>
 *   <media-provider></media-provider>
 *   <!-- ... -->
 * </media-player>
 * ```
 */
export class MediaProviderElement extends Host(HTMLElement, MediaProvider) {
  static tagName = 'media-provider';

  private _media!: MediaContext;
  private _mediaElement: HTMLMediaElement | null = null;

  protected onSetup(): void {
    this._media = useMediaContext();
    this.setAttribute('keep-alive', '');
  }

  protected onDestroy(): void {
    this._mediaElement?.remove();
    this._mediaElement = null;
  }

  protected onConnect(): void {
    effect(() => {
      const loader = this.$state.loader();

      const media = loader
        ? loader.mediaType() === 'audio'
          ? this._createAudio()
          : this._createVideo()
        : null;

      if (this._mediaElement !== media) {
        const parent = this._mediaElement?.parentElement ?? this;
        this._mediaElement?.remove();
        this._mediaElement = media;
        if (media) parent.prepend(media);
      }

      this.load(media);
    });
  }

  private _createAudio() {
    const audio =
      this._mediaElement instanceof HTMLAudioElement
        ? this._mediaElement
        : document.createElement('audio');

    setAttribute(audio, 'preload', 'none');
    setAttribute(audio, 'aria-hidden', 'true');

    const { controls, crossorigin } = this._media.$state;
    effect(() => {
      setAttribute(audio, 'controls', controls());
      setAttribute(audio, 'crossorigin', crossorigin());
    });

    return audio;
  }

  private _createVideo() {
    const video =
      this._mediaElement instanceof HTMLVideoElement
        ? this._mediaElement
        : document.createElement('video');

    const { controls, crossorigin, poster } = this._media.$state,
      { $iosControls } = this._media,
      $nativeControls = computed(() => (controls() || $iosControls() ? '' : null)),
      $poster = computed(() => (poster() && (controls() || $iosControls()) ? poster() : null));

    effect(() => {
      setAttribute(video, 'controls', $nativeControls());
      setAttribute(video, 'crossorigin', crossorigin());
      setAttribute(video, 'poster', $poster());
    });

    return video;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-provider': MediaProviderElement;
  }
}
