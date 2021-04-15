/* c8 ignore next 1000 */
import {
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';

import { mediaContext, MediaContextProvider } from '../media/media.context';
import { uuidContext } from '../uuid/uuid.context';

export class FakeMediaConsumerElement
  extends LitElement
  implements MediaContextProvider {
  @internalProperty()
  @mediaContext.aspectRatio.consume()
  aspectRatio = mediaContext.aspectRatio.defaultValue;

  @internalProperty()
  @mediaContext.autoplay.consume()
  autoplay = mediaContext.autoplay.defaultValue;

  @internalProperty()
  @mediaContext.currentSrc.consume()
  currentSrc = mediaContext.currentSrc.defaultValue;

  @internalProperty()
  @mediaContext.volume.consume()
  volume = mediaContext.volume.defaultValue;

  @internalProperty()
  @mediaContext.currentTime.consume()
  currentTime = mediaContext.currentTime.defaultValue;

  @internalProperty()
  @mediaContext.paused.consume()
  paused = mediaContext.paused.defaultValue;

  @internalProperty()
  @mediaContext.controls.consume()
  controls = mediaContext.controls.defaultValue;

  @internalProperty()
  @mediaContext.currentPoster.consume()
  currentPoster = mediaContext.currentPoster.defaultValue;

  @internalProperty()
  @mediaContext.muted.consume()
  muted = mediaContext.muted.defaultValue;

  @internalProperty()
  @mediaContext.playsinline.consume()
  playsinline = mediaContext.playsinline.defaultValue;

  @internalProperty()
  @mediaContext.loop.consume()
  loop = mediaContext.loop.defaultValue;

  @internalProperty()
  @mediaContext.duration.consume()
  duration = mediaContext.duration.defaultValue;

  @internalProperty()
  @mediaContext.buffered.consume()
  buffered = mediaContext.buffered.defaultValue;

  @internalProperty()
  @mediaContext.bufferedAmount.consume()
  bufferedAmount = mediaContext.bufferedAmount.defaultValue;

  @internalProperty()
  @mediaContext.waiting.consume()
  waiting = mediaContext.waiting.defaultValue;

  @internalProperty()
  @mediaContext.playing.consume()
  playing = mediaContext.playing.defaultValue;

  @internalProperty()
  @mediaContext.started.consume()
  started = mediaContext.started.defaultValue;

  @internalProperty()
  @mediaContext.ended.consume()
  ended = mediaContext.ended.defaultValue;

  @internalProperty()
  @mediaContext.error.consume()
  error = mediaContext.error.defaultValue;

  @internalProperty()
  @mediaContext.canPlay.consume()
  canPlay = mediaContext.canPlay.defaultValue;

  @internalProperty()
  @mediaContext.canPlayThrough.consume()
  canPlayThrough = mediaContext.canPlayThrough.defaultValue;

  @internalProperty()
  @mediaContext.viewType.consume()
  viewType = mediaContext.viewType.defaultValue;

  @internalProperty()
  @mediaContext.isAudioView.consume()
  isAudioView = mediaContext.isAudioView.defaultValue;

  @internalProperty()
  @mediaContext.isVideoView.consume()
  isVideoView = mediaContext.isVideoView.defaultValue;

  @internalProperty()
  @mediaContext.mediaType.consume()
  mediaType = mediaContext.mediaType.defaultValue;

  @internalProperty()
  @mediaContext.isAudio.consume()
  isAudio = mediaContext.isAudio.defaultValue;

  @internalProperty()
  @mediaContext.isVideo.consume()
  isVideo = mediaContext.isVideo.defaultValue;

  @internalProperty()
  @mediaContext.played.consume()
  played = mediaContext.played.defaultValue;

  @internalProperty()
  @mediaContext.seekable.consume()
  seekable = mediaContext.seekable.defaultValue;

  @internalProperty()
  @mediaContext.seekableAmount.consume()
  seekableAmount = mediaContext.seekableAmount.defaultValue;

  @internalProperty()
  @mediaContext.seeking.consume()
  seeking = mediaContext.seeking.defaultValue;

  @internalProperty()
  @uuidContext.consume()
  uuid = uuidContext.defaultValue;

  @internalProperty()
  @mediaContext.fullscreen.consume()
  fullscreen = mediaContext.fullscreen.defaultValue;

  @internalProperty()
  @mediaContext.canRequestFullscreen.consume()
  canRequestFullscreen = mediaContext.canRequestFullscreen.defaultValue;

  @internalProperty()
  @mediaContext.screenOrientation.consume()
  screenOrientation = mediaContext.screenOrientation.defaultValue;

  @internalProperty()
  @mediaContext.canOrientScreen.consume()
  canOrientScreen = mediaContext.canOrientScreen.defaultValue;

  @internalProperty()
  @mediaContext.screenOrientationLocked.consume()
  screenOrientationLocked = mediaContext.screenOrientationLocked.defaultValue;

  render(): TemplateResult {
    return html`<div>fake media consumer</div>`;
  }
}
