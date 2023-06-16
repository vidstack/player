import { onDispose } from 'maverick.js';

import {
  canPlayHLSNatively,
  canUsePictureInPicture,
  canUseVideoPresentation,
} from '../../../utils/support';
import type { MediaContext } from '../../core/api/context';
import { ATTACH_VIDEO } from '../../core/tracks/text/symbols';
import { HTMLMediaProvider } from '../html/provider';
import type {
  MediaFullscreenAdapter,
  MediaPictureInPictureAdapter,
  MediaProvider,
  MediaSetupContext,
} from '../types';
import { NativeHLSTextTracks } from './native-hls-text-tracks';
import { VideoPictureInPicture } from './picture-in-picture';
import {
  FullscreenPresentationAdapter,
  PIPPresentationAdapter,
  VideoPresentation,
} from './presentation/video-presentation';

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
  protected $$PROVIDER_TYPE = 'VIDEO';

  override get type() {
    return 'video';
  }

  fullscreen?: MediaFullscreenAdapter;
  pictureInPicture?: MediaPictureInPictureAdapter;

  constructor(video: HTMLVideoElement, context: MediaContext) {
    super(video);
    if (canUseVideoPresentation(video)) {
      const presentation = new VideoPresentation(video, context);
      this.fullscreen = new FullscreenPresentationAdapter(presentation);
      this.pictureInPicture = new PIPPresentationAdapter(presentation);
    } else if (canUsePictureInPicture(video)) {
      this.pictureInPicture = new VideoPictureInPicture(video, context);
    }
  }

  override setup(context: MediaSetupContext): void {
    super.setup(context);

    if (canPlayHLSNatively(this.video)) {
      new NativeHLSTextTracks(this.video, context);
    }

    context.textRenderers[ATTACH_VIDEO](this.video);
    onDispose(() => {
      context.textRenderers[ATTACH_VIDEO](null);
    });

    if (this.type === 'video') context.delegate._dispatch('provider-setup', { detail: this });
  }

  /**
   * The native HTML `<video>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
   */
  get video() {
    return this._media as HTMLVideoElement;
  }
}
