import type { MediaContext } from '../../context';
import { HTMLMediaProvider } from '../html/provider';
import type { MediaProvider, MediaSetupContext } from '../types';
import {
  useVideoPresentation,
  VideoPresentationAdapter,
} from './presentation/use-video-presentation';

export const VIDEO_PROVIDER = Symbol(__DEV__ ? 'VIDEO_PROVIDER' : 0);

/**
 * The video provider adapts the `<video>` element to enable loading videos via the HTML Media
 * Element API.
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/720p.mp4"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <media-outlet></media-outlet>
 * </media-player>
 * ```
 */
export class VideoProvider extends HTMLMediaProvider implements MediaProvider {
  [VIDEO_PROVIDER] = true;

  override get type() {
    return 'video';
  }

  fullscreen: VideoPresentationAdapter;

  constructor(media: HTMLVideoElement, context: MediaContext) {
    super(media);
    this.fullscreen = useVideoPresentation(media, context);
  }

  override setup(context: MediaSetupContext): void {
    super.setup(context);
    if (this.type === 'video') context.delegate.dispatch('provider-setup', { detail: this });
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
