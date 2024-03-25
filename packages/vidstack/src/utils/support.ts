import { isFunction, isUndefined, waitTimeout } from 'maverick.js/std';

export const UA = __SERVER__ ? '' : navigator?.userAgent.toLowerCase() || '';
export const IS_IOS = !__SERVER__ && /iphone|ipad|ipod|ios|crios|fxios/i.test(UA);
export const IS_IPHONE = !__SERVER__ && /(iphone|ipod)/gi.test(navigator?.platform || '');
export const IS_CHROME = !__SERVER__ && !!window.chrome;
export const IS_IOS_CHROME = !__SERVER__ && /crios/i.test(UA);
export const IS_SAFARI = !__SERVER__ && (!!window.safari || IS_IOS);

/**
 * Returns the current Android OS version. Defaults to `0` if unknown.
 */
export function getAndroidVersion() {
  const version = parseFloat(UA.match(/android\s([0-9\.]*)/)?.[1] ?? '0');
  return !isNaN(version) ? version : 0;
}

/**
 * Checks whether the `IntersectionObserver` API is available.
 */
export function canObserveIntersection(): boolean {
  return !__SERVER__ && !isUndefined(window.IntersectionObserver);
}

/**
 * Checks if the ScreenOrientation API is available.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
 */
export function canOrientScreen(): boolean {
  return canRotateScreen() && isFunction(screen.orientation.unlock);
}

/**
 * Checks if the screen orientation can be changed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
 */
export function canRotateScreen(): boolean {
  return (
    !__SERVER__ &&
    !isUndefined(window.screen.orientation) &&
    !isUndefined((window.screen.orientation as any).lock)
  );
}

/**
 * Reduced motion iOS & MacOS setting.
 *
 * @see {@link https://webkit.org/blog/7551/responsive-design-for-motion/}
 */
export function isReducedMotionPreferred(): boolean {
  return (
    !__SERVER__ && 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches
  );
}

export function canPlayAudioType(audio: HTMLAudioElement | null, type: string): boolean {
  if (__SERVER__) return false;
  if (!audio) audio = document.createElement('audio');
  return audio.canPlayType(type).length > 0;
}

export function canPlayVideoType(video: HTMLVideoElement | null, type: string): boolean {
  if (__SERVER__) return false;
  if (!video) video = document.createElement('video');
  return video.canPlayType(type).length > 0;
}

/**
 * Checks if the native HTML5 video player can play HLS.
 */
export function canPlayHLSNatively(video?: HTMLVideoElement | null): boolean {
  if (__SERVER__) return false;
  if (!video) video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl').length > 0;
}

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @see {@link https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture}
 */
export function canUsePictureInPicture(video: HTMLVideoElement | null): boolean {
  if (__SERVER__) return false;
  return !!document.pictureInPictureEnabled && !video?.disablePictureInPicture;
}

/**
 * Checks if the native HTML5 video player can use the presentation API in Safari.
 *
 * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode}
 */
export function canUseVideoPresentation(video: HTMLVideoElement | null): boolean {
  if (__SERVER__) return false;
  return (
    isFunction(video?.webkitSupportsPresentationMode) &&
    isFunction(video?.webkitSetPresentationMode)
  );
}

export async function canChangeVolume() {
  const video = document.createElement('video');
  video.volume = 0.5;
  await waitTimeout(0);
  return video.volume === 0.5;
}

/**
 * @see {@link https://github.com/video-dev/hls.js/blob/master/src/is-supported.ts}
 */
export function getMediaSource(): typeof MediaSource | undefined {
  return __SERVER__
    ? undefined
    : window?.ManagedMediaSource ?? window?.MediaSource ?? window?.WebKitMediaSource;
}

/**
 * @see {@link https://github.com/video-dev/hls.js/blob/master/src/is-supported.ts}
 */
export function getSourceBuffer(): typeof SourceBuffer | undefined {
  return __SERVER__ ? undefined : window?.SourceBuffer ?? window?.WebKitSourceBuffer;
}

/**
 * Whether `hls.js` is supported in this environment. Checks whether `MediaSource` or
 * `ManagedMediaSource` and a valid `SourceBuffer` API are available.
 *
 * @see {@link https://github.com/video-dev/hls.js/blob/master/src/is-supported.ts}
 */
export function isHLSSupported(): boolean {
  if (__SERVER__) return false;

  const MediaSource = getMediaSource();

  if (isUndefined(MediaSource)) return false;

  const isTypeSupported =
    MediaSource &&
    isFunction(MediaSource.isTypeSupported) &&
    MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');

  const SourceBuffer = getSourceBuffer();

  // If SourceBuffer is exposed ensure its API is valid because safari and old versions of Chrome
  // do not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible.
  const isSourceBufferValid =
    isUndefined(SourceBuffer) ||
    (!isUndefined(SourceBuffer.prototype) &&
      isFunction(SourceBuffer.prototype.appendBuffer) &&
      isFunction(SourceBuffer.prototype.remove));

  return !!isTypeSupported && !!isSourceBufferValid;
}

/**
 * Whether `dashjs` is supported in this environment. Checks whether `MediaSource` or
 * `ManagedMediaSource` and a valid `SourceBuffer` API are available.
 */
export function isDASHSupported(): boolean {
  return isHLSSupported();
}
