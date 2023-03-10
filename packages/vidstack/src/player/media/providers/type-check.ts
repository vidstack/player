import { AUDIO_PROVIDER, type AudioProvider } from './audio/provider';
import { HLS_PROVIDER, type HLSProvider } from './hls/provider';
import { VIDEO_PROVIDER, type VideoProvider } from './video/provider';

/** @see {@link https://www.vidstack.io/docs/player/providers/audio} */
export function isAudioProvider(provider: unknown): provider is AudioProvider {
  return !!provider?.[AUDIO_PROVIDER];
}

/** @see {@link https://www.vidstack.io/docs/player/providers/video} */
export function isVideoProvider(provider: unknown): provider is VideoProvider {
  return !!provider?.[VIDEO_PROVIDER];
}

/** @see {@link https://www.vidstack.io/docs/player/providers/hls} */
export function isHLSProvider(provider: unknown): provider is HLSProvider {
  return !!provider?.[HLS_PROVIDER];
}

/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement} */
export function isHTMLAudioElement(element: unknown): element is HTMLAudioElement {
  return !__SERVER__ && element instanceof HTMLAudioElement;
}

/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement} */
export function isHTMLVideoElement(element: unknown): element is HTMLVideoElement {
  return !__SERVER__ && element instanceof HTMLVideoElement;
}

/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement} */
export function isHTMLMediaElement(element: unknown): element is HTMLMediaElement {
  return isHTMLAudioElement(element) || isHTMLVideoElement(element);
}
