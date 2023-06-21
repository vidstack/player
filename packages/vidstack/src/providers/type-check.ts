import type { AudioProvider } from './audio/provider';
import type { HLSProvider } from './hls/provider';
import type { VideoProvider } from './video/provider';

/** @see {@link https://www.vidstack.io/docs/player/providers/audio} */
export function isAudioProvider(provider: any): provider is AudioProvider {
  return provider?.$$PROVIDER_TYPE === 'AUDIO';
}

/** @see {@link https://www.vidstack.io/docs/player/providers/video} */
export function isVideoProvider(provider: any): provider is VideoProvider {
  return provider?.$$PROVIDER_TYPE === 'VIDEO';
}

/** @see {@link https://www.vidstack.io/docs/player/providers/hls} */
export function isHLSProvider(provider: any): provider is HLSProvider {
  return provider?.$$PROVIDER_TYPE === 'HLS';
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
