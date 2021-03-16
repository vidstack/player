/* c8 ignore next 1000 */
import {
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';

import { deviceContext } from '../device/device.context';
import { playerContext, PlayerContextProvider } from '../player.context';
import { uuidContext } from '../uuid/uuid.context';

export class FakeContextConsumer
  extends LitElement
  implements PlayerContextProvider {
  @internalProperty()
  @uuidContext.consume()
  uuid = uuidContext.defaultValue;

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
  @playerContext.aspectRatio.consume()
  aspectRatio = playerContext.aspectRatio.defaultValue;

  @internalProperty()
  @playerContext.duration.consume()
  duration = playerContext.duration.defaultValue;

  @internalProperty()
  @playerContext.buffered.consume()
  buffered = playerContext.buffered.defaultValue;

  @internalProperty()
  @deviceContext.device.consume()
  device = deviceContext.device.defaultValue;

  @internalProperty()
  @deviceContext.isMobileDevice.consume()
  isMobileDevice = deviceContext.isMobileDevice.defaultValue;

  @internalProperty()
  @deviceContext.isDesktopDevice.consume()
  isDesktopDevice = deviceContext.isDesktopDevice.defaultValue;

  @internalProperty()
  @playerContext.buffering.consume()
  buffering = playerContext.buffering.defaultValue;

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
  @playerContext.isPlaybackReady.consume()
  isPlaybackReady = playerContext.isPlaybackReady.defaultValue;

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

  render(): TemplateResult {
    return html`<div>fake consumer</div>`;
  }
}
