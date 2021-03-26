/* c8 ignore next 1000 */

import { isFunction, isUndefined, noop } from './unit';

export const IS_CLIENT = typeof window !== 'undefined';
export const UA = IS_CLIENT ? window.navigator?.userAgent.toLowerCase() : '';
export const IS_IOS = /iphone|ipad|ipod|ios|CriOS|FxiOS/.test(UA);
export const IS_ANDROID = /android/.test(UA);
export const IS_MOBILE = IS_CLIENT && (IS_IOS || IS_ANDROID);
export const IS_IPHONE =
  IS_CLIENT && /(iPhone|iPod)/gi.test(window.navigator?.platform);
export const IS_FIREFOX = /firefox/.test(UA);
export const IS_CHROME = IS_CLIENT && window.chrome;
export const IS_SAFARI =
  IS_CLIENT && (window.safari || IS_IOS || /(apple|safari)/.test(UA));

export const ORIGIN =
  window.location.protocol !== 'file:'
    ? `${window.location.protocol}//${window.location.hostname}`
    : undefined;

/**
 * Returns the current version of Safari. Defaults to `0` if unknown.
 */
export const currentSafariVersion = (): number =>
  IS_CLIENT
    ? Number((/Safari\/(\d+)/.exec(navigator.userAgent) ?? ['', 0])[1])
    : 0;

/**
 * Checks if a video player can enter fullscreen.
 *
 * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
 */
export const canFullscreenVideo = (): boolean => {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return isFunction(video.webkitEnterFullscreen);
};

/**
 * Checks whether the `IntersectionObserver` API is available.
 */
export const canObserveIntersection = (): boolean => {
  return IS_CLIENT && !isUndefined(window.IntersectionObserver);
};

/**
 * Checks if the ScreenOrientation API is available.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export const canOrientScreen = (): boolean =>
  IS_CLIENT &&
  !isUndefined(screen.orientation) &&
  isFunction(screen.orientation.lock) &&
  isFunction(screen.orientation.unlock);

/**
 * Checks if the screen orientation can be changed.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export const canRotateScreen = (): boolean =>
  IS_CLIENT &&
  !isUndefined(window.screen.orientation) &&
  !isUndefined(window.screen.orientation.lock);

/**
 * Reduced motion iOS & MacOS setting.
 *
 * @link https://webkit.org/blog/7551/responsive-design-for-motion/
 */
export const isReducedMotionPreferred = (): boolean =>
  IS_CLIENT &&
  'matchMedia' in window &&
  window.matchMedia('(prefers-reduced-motion)').matches;

/**
 * Checks if the native HTML5 video player can play HLS.
 */
export const canPlayHLSNatively = (): boolean => {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl').length > 0;
};

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @link  https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
 */
export const canUsePiPInChrome = (): boolean => {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
};

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @link https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */
export const canUsePiPInSafari = (): boolean => {
  if (!IS_CLIENT) return false;

  const video = document.createElement('video');

  return (
    isFunction(video.webkitSupportsPresentationMode) &&
    isFunction(video.webkitSetPresentationMode) &&
    !IS_IPHONE
  );
};

/**
 * Checks if the native HTML5 video player can enter PIP.
 */
export const canUsePiP = (): boolean =>
  canUsePiPInChrome() || canUsePiPInSafari();

/**
 * To detect autoplay, we create a video element and call play on it, if it is `paused` after
 * a `play()` call, autoplay is supported. Although this unintuitive, it works across browsers
 * and is currently the lightest way to detect autoplay without using a data source.
 *
 * @link https://github.com/ampproject/amphtml/blob/9bc8756536956780e249d895f3e1001acdee0bc0/src/utils/video.js#L25
 */
export const canAutoplay = (
  muted = true,
  playsinline = true,
): Promise<boolean> => {
  if (!IS_CLIENT) return Promise.resolve(false);

  const video = document.createElement('video');

  if (muted) {
    video.setAttribute('muted', '');
    video.muted = true;
  }

  if (playsinline) {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }

  video.setAttribute('height', '0');
  video.setAttribute('width', '0');

  video.style.position = 'fixed';
  video.style.top = '0';
  video.style.width = '0';
  video.style.height = '0';
  video.style.opacity = '0';

  // Promise wrapped this way to catch both sync throws and async rejections.
  // More info: https://github.com/tc39/proposal-promise-try
  new Promise(resolve => resolve(video.play())).catch(noop);

  return Promise.resolve(!video.paused);
};
