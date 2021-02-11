import { LitElement } from 'lit-element';
import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils';
import { playerContext } from '../player.context';

export class FakeConsumer extends LitElement {
  @playerContext.uuid.consume()
  uuid = playerContext.uuid.defaultValue;

  @playerContext.src.consume()
  src = playerContext.src.defaultValue;

  @playerContext.volume.consume()
  volume = playerContext.volume.defaultValue;

  @playerContext.currentTime.consume()
  currentTime = playerContext.currentTime.defaultValue;

  @playerContext.paused.consume()
  paused = playerContext.paused.defaultValue;

  @playerContext.poster.consume()
  poster = playerContext.poster.defaultValue;

  @playerContext.muted.consume()
  muted = playerContext.muted.defaultValue;

  @playerContext.aspectRatio.consume()
  aspectRatio = playerContext.aspectRatio.defaultValue;

  @playerContext.duration.consume()
  duration = playerContext.duration.defaultValue;

  @playerContext.buffered.consume()
  buffered = playerContext.buffered.defaultValue;

  @playerContext.device.consume()
  deviceCtx = playerContext.device.defaultValue;

  @playerContext.isMobileDevice.consume()
  isMobileCtx = playerContext.isMobileDevice.defaultValue;

  @playerContext.isDesktopDevice.consume()
  isDesktopDeviceCtx = playerContext.isDesktopDevice.defaultValue;

  @playerContext.inputDevice.consume()
  inputDeviceCtx = playerContext.inputDevice.defaultValue;

  @playerContext.isTouchInputDevice.consume()
  isTouchInputDeviceCtx = playerContext.isTouchInputDevice.defaultValue;

  @playerContext.isMouseInputDevice.consume()
  isMouseInputDeviceCtx = playerContext.isMouseInputDevice.defaultValue;

  @playerContext.isKeyboardInputDevice.consume()
  isKeyboardInputDeviceCtx = playerContext.isKeyboardInputDevice.defaultValue;

  @playerContext.isBuffering.consume()
  isBuffering = playerContext.isBuffering.defaultValue;

  @playerContext.isPlaying.consume()
  isPlaying = playerContext.isPlaying.defaultValue;

  @playerContext.hasPlaybackStarted.consume()
  hasPlaybackStarted = playerContext.hasPlaybackStarted.defaultValue;

  @playerContext.hasPlaybackEnded.consume()
  hasPlaybackEnded = playerContext.hasPlaybackEnded.defaultValue;

  @playerContext.isProviderReady.consume()
  isProviderReady = playerContext.isProviderReady.defaultValue;

  @playerContext.isPlaybackReady.consume()
  isPlaybackReady = playerContext.isPlaybackReady.defaultValue;

  @playerContext.viewType.consume()
  viewType = playerContext.viewType.defaultValue;

  @playerContext.isAudioView.consume()
  isAudioView = playerContext.isAudioView.defaultValue;

  @playerContext.isVideoView.consume()
  isVideoView = playerContext.isVideoView.defaultValue;

  @playerContext.mediaType.consume()
  mediaType = playerContext.mediaType.defaultValue;

  @playerContext.isAudio.consume()
  isAudio = playerContext.isAudio.defaultValue;

  @playerContext.isVideo.consume()
  isVideo = playerContext.isVideo.defaultValue;
}

safelyDefineCustomElement(`${LIB_PREFIX}-fake-consumer`, FakeConsumer);
