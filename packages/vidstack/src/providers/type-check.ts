import type { AudioProvider } from './audio/provider';
import type { HLSProvider } from './hls/provider';
import type { VideoProvider } from './video/provider';
import type { VimeoProvider } from './vimeo/provider';
import type { YouTubeProvider } from './youtube/provider';

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

/** @see {@link https://www.vidstack.io/docs/player/providers/youtube} */
export function isYouTubeProvider(provider: any): provider is YouTubeProvider {
  return provider?.$$PROVIDER_TYPE === 'YOUTUBE';
}

/** @see {@link https://www.vidstack.io/docs/player/providers/vimeo} */
export function isVimeoProvider(provider: any): provider is VimeoProvider {
  return provider?.$$PROVIDER_TYPE === 'VIMEO';
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

/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement} */
export function isHTMLIFrameElement(element: unknown): element is HTMLIFrameElement {
  return !__SERVER__ && element instanceof HTMLIFrameElement;
}
