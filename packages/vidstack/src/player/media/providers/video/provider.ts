import { HTMLMediaProvider } from '../html/provider';
import type { MediaProvider, MediaProviderContext } from '../types';
import {
  useVideoPresentation,
  VideoPresentationAdapter,
} from './presentation/use-video-presentation';

export const VIDEO_PROVIDER = Symbol(__DEV__ ? 'VIDEO_PROVIDER' : 0);

/**
 * The video provider adapts the `<video>` element to enable loading videos via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/providers/video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @example
 * ```html
 * <vds-media
 *   src="https://media-files.vidstack.io/720p.mp4"
 *   poster="https://media-files.vidstack.io/poster.png"
 * ></vds-media>
 * ```
 */
export class VideoProvider extends HTMLMediaProvider implements MediaProvider {
  [VIDEO_PROVIDER] = true;

  fullscreen: VideoPresentationAdapter;

  constructor(media: HTMLVideoElement, context: MediaProviderContext) {
    super(media);
    this.fullscreen = useVideoPresentation(media, context);
  }

  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
   */
  get video() {
    return this._media as HTMLVideoElement;
  }
}
