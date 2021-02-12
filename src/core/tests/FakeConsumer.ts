import {
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';
import { playerContext } from '../player.context';

export class FakeConsumer extends LitElement {
  @internalProperty()
  @playerContext.uuid.consume()
  uuid = playerContext.uuid.defaultValue;

  @internalProperty()
  @playerContext.src.consume()
  src = playerContext.src.defaultValue;

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
  @playerContext.poster.consume()
  poster = playerContext.poster.defaultValue;

  @internalProperty()
  @playerContext.muted.consume()
  muted = playerContext.muted.defaultValue;

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
  @playerContext.device.consume()
  device = playerContext.device.defaultValue;

  @internalProperty()
  @playerContext.isMobileDevice.consume()
  isMobileDevice = playerContext.isMobileDevice.defaultValue;

  @internalProperty()
  @playerContext.isDesktopDevice.consume()
  isDesktopDevice = playerContext.isDesktopDevice.defaultValue;

  @internalProperty()
  @playerContext.inputDevice.consume()
  inputDevice = playerContext.inputDevice.defaultValue;

  @internalProperty()
  @playerContext.isTouchInputDevice.consume()
  isTouchInputDevice = playerContext.isTouchInputDevice.defaultValue;

  @internalProperty()
  @playerContext.isMouseInputDevice.consume()
  isMouseInputDevice = playerContext.isMouseInputDevice.defaultValue;

  @internalProperty()
  @playerContext.isKeyboardInputDevice.consume()
  isKeyboardInputDevice = playerContext.isKeyboardInputDevice.defaultValue;

  @internalProperty()
  @playerContext.isBuffering.consume()
  isBuffering = playerContext.isBuffering.defaultValue;

  @internalProperty()
  @playerContext.isPlaying.consume()
  isPlaying = playerContext.isPlaying.defaultValue;

  @internalProperty()
  @playerContext.hasPlaybackStarted.consume()
  hasPlaybackStarted = playerContext.hasPlaybackStarted.defaultValue;

  @internalProperty()
  @playerContext.hasPlaybackEnded.consume()
  hasPlaybackEnded = playerContext.hasPlaybackEnded.defaultValue;

  @internalProperty()
  @playerContext.isProviderReady.consume()
  isProviderReady = playerContext.isProviderReady.defaultValue;

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
