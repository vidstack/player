import { onDispose, scoped } from 'maverick.js';

import type { MediaContext } from '../../core/api/media-context';
import {
  canPlayHLSNatively,
  canUsePictureInPicture,
  canUseVideoPresentation,
} from '../../utils/support';
import { HTMLMediaProvider } from '../html/provider';
import type {
  MediaFullscreenAdapter,
  MediaPictureInPictureAdapter,
  MediaProviderAdapter,
  MediaRemotePlaybackAdapter,
} from '../types';
import { NativeHLSTextTracks } from './native-hls-text-tracks';
import { VideoPictureInPicture } from './picture-in-picture';
import {
  FullscreenPresentationAdapter,
  PIPPresentationAdapter,
  VideoPresentation,
} from './presentation/video-presentation';
import { VideoAirPlayAdapter } from './remote-playback';

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
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class VideoProvider extends HTMLMediaProvider implements MediaProviderAdapter {
  protected $$PROVIDER_TYPE = 'VIDEO';

  override get type() {
    return 'video';
  }

  airPlay?: MediaRemotePlaybackAdapter;
  fullscreen?: MediaFullscreenAdapter;
  pictureInPicture?: MediaPictureInPictureAdapter;

  constructor(video: HTMLVideoElement, ctx: MediaContext) {
    super(video, ctx);

    scoped(() => {
      this.airPlay = new VideoAirPlayAdapter(video, ctx);

      if (canUseVideoPresentation(video)) {
        const presentation = new VideoPresentation(video, ctx);
        this.fullscreen = new FullscreenPresentationAdapter(presentation);
        this.pictureInPicture = new PIPPresentationAdapter(presentation);
      } else if (canUsePictureInPicture(video)) {
        this.pictureInPicture = new VideoPictureInPicture(video, ctx);
      }
    }, this.scope);
  }

  override setup(): void {
    super.setup();

    if (canPlayHLSNatively(this.video)) {
      new NativeHLSTextTracks(this.video, this._ctx);
    }

    this._ctx.textRenderers._attachVideo(this.video);
    onDispose(() => {
      this._ctx.textRenderers._attachVideo(null);
    });

    if (this.type === 'video') this._ctx.delegate._notify('provider-setup', this);
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
