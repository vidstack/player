/* c8 ignore next 1000 */
import {
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';

import { playerContext, PlayerContextProvider } from '../player.context';
import { uuidContext } from '../uuid/uuid.context';

export class FakeContextConsumer
  extends LitElement
  implements PlayerContextProvider {
  @internalProperty()
  @playerContext.aspectRatio.consume()
  aspectRatio = playerContext.aspectRatio.defaultValue;

  @internalProperty()
  @playerContext.autoplay.consume()
  autoplay = playerContext.autoplay.defaultValue;

  @internalProperty()
  @playerContext.currentSrc.consume()
  currentSrc = playerContext.currentSrc.defaultValue;

  @internalProperty()
  @playerContext.volume.consume()
  volume = playerContext.volume.defaultValue;

  @internalProperty()
  @playerContext.currentTime.consume()
  currentTime = playerContext.currentTime.defaultValue;

  @internalProperty()
  @playerContext.paused.consume()
  paused = playerContext.paused.defaultValue;

  @internalProperty()
  @playerContext.controls.consume()
  controls = playerContext.controls.defaultValue;

  @internalProperty()
  @playerContext.currentPoster.consume()
  currentPoster = playerContext.currentPoster.defaultValue;

  @internalProperty()
  @playerContext.muted.consume()
  muted = playerContext.muted.defaultValue;

  @internalProperty()
  @playerContext.playsinline.consume()
  playsinline = playerContext.playsinline.defaultValue;

  @internalProperty()
  @playerContext.loop.consume()
  loop = playerContext.loop.defaultValue;

  @internalProperty()
  @playerContext.duration.consume()
  duration = playerContext.duration.defaultValue;

  @internalProperty()
  @playerContext.buffered.consume()
  buffered = playerContext.buffered.defaultValue;

  @internalProperty()
  @playerContext.bufferedAmount.consume()
  bufferedAmount = playerContext.bufferedAmount.defaultValue;

  @internalProperty()
  @playerContext.waiting.consume()
  waiting = playerContext.waiting.defaultValue;

  @internalProperty()
  @playerContext.playing.consume()
  playing = playerContext.playing.defaultValue;

  @internalProperty()
  @playerContext.started.consume()
  started = playerContext.started.defaultValue;

  @internalProperty()
  @playerContext.ended.consume()
  ended = playerContext.ended.defaultValue;

  @internalProperty()
  @playerContext.canPlay.consume()
  canPlay = playerContext.canPlay.defaultValue;

  @internalProperty()
  @playerContext.canPlayThrough.consume()
  canPlayThrough = playerContext.canPlayThrough.defaultValue;

  @internalProperty()
  @playerContext.viewType.consume()
  viewType = playerContext.viewType.defaultValue;

  @internalProperty()
  @playerContext.isAudioView.consume()
  isAudioView = playerContext.isAudioView.defaultValue;

  @internalProperty()
  @playerContext.isVideoView.consume()
  isVideoView = playerContext.isVideoView.defaultValue;

  @internalProperty()
  @playerContext.mediaType.consume()
  mediaType = playerContext.mediaType.defaultValue;

  @internalProperty()
  @playerContext.isAudio.consume()
  isAudio = playerContext.isAudio.defaultValue;

  @internalProperty()
  @playerContext.isVideo.consume()
  isVideo = playerContext.isVideo.defaultValue;

  @internalProperty()
  @playerContext.played.consume()
  played = playerContext.played.defaultValue;

  @internalProperty()
  @playerContext.seekable.consume()
  seekable = playerContext.seekable.defaultValue;

  @internalProperty()
  @playerContext.seekableAmount.consume()
  seekableAmount = playerContext.seekableAmount.defaultValue;

  @internalProperty()
  @uuidContext.consume()
  uuid = uuidContext.defaultValue;

  render(): TemplateResult {
    return html`<div>fake consumer</div>`;
  }
}
