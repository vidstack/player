/* c8 ignore next 1000 */
var _a, _b;
import { isFunction, isUndefined, noop } from './unit.js';
export const IS_CLIENT = typeof window !== 'undefined';
export const UA = IS_CLIENT
  ? (_a = window.navigator) === null || _a === void 0
    ? void 0
    : _a.userAgent.toLowerCase()
  : '';
export const IS_IOS = /iphone|ipad|ipod|ios|CriOS|FxiOS/.test(UA);
export const IS_ANDROID = /android/.test(UA);
export const IS_MOBILE = IS_CLIENT && (IS_IOS || IS_ANDROID);
export const IS_IPHONE =
  IS_CLIENT &&
  /(iPhone|iPod)/gi.test(
    (_b = window.navigator) === null || _b === void 0 ? void 0 : _b.platform
  );
export const IS_FIREFOX = /firefox/.test(UA);
export const IS_CHROME = IS_CLIENT && !!window.chrome;
export const IS_SAFARI =
  IS_CLIENT &&
  !IS_CHROME &&
  (window.safari || IS_IOS || /(apple|safari)/.test(UA));
export const ORIGIN =
  window.location.protocol !== 'file:'
    ? `${window.location.protocol}//${window.location.hostname}`
    : undefined;
/**
 * Returns the current version of Safari. Defaults to `0` if unknown.
 *
 * @returns {number}
 */
export function currentSafariVersion() {
  var _a;
  return IS_CLIENT
    ? Number(
        ((_a = /Safari\/(\d+)/.exec(navigator.userAgent)) !== null &&
        _a !== void 0
          ? _a
          : ['', 0])[1]
      )
    : 0;
}
/**
 * Checks if a video player can enter fullscreen.
 *
 * @returns {boolean}
 * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
 */
export function canFullscreenVideo() {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return isFunction(video.webkitEnterFullscreen);
}
/**
 * Checks whether the `IntersectionObserver` API is available.
 *
 * @returns {boolean}
 */
export function canObserveIntersection() {
  return IS_CLIENT && !isUndefined(window.IntersectionObserver);
}
/**
 * Checks if the ScreenOrientation API is available.
 *
 * @returns {boolean}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export function canOrientScreen() {
  return (
    IS_CLIENT &&
    !isUndefined(screen.orientation) &&
    isFunction(screen.orientation.lock) &&
    isFunction(screen.orientation.unlock)
  );
}
/**
 * Checks if the screen orientation can be changed.
 *
 * @returns {boolean}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export function canRotateScreen() {
  return (
    IS_CLIENT &&
    !isUndefined(window.screen.orientation) &&
    !isUndefined(window.screen.orientation.lock)
  );
}
/**
 * Reduced motion iOS & MacOS setting.
 *
 * @returns {boolean}
 * @link https://webkit.org/blog/7551/responsive-design-for-motion/
 */
export function isReducedMotionPreferred() {
  return (
    IS_CLIENT &&
    'matchMedia' in window &&
    window.matchMedia('(prefers-reduced-motion)').matches
  );
}
/**
 * Checks if the native HTML5 video player can play HLS.
 *
 * @returns {boolean}
 */
export function canPlayHLSNatively() {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl').length > 0;
}
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @returns {boolean}
 * @link  https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
 */
export function canUsePiPInChrome() {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
}
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @returns {boolean}
 * @link https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */
export function canUsePiPInSafari() {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  return (
    isFunction(video.webkitSupportsPresentationMode) &&
    isFunction(video.webkitSetPresentationMode) &&
    !IS_IPHONE
  );
}
/**
 * Checks if the native HTML5 video player can enter PIP.
 *
 * @returns {boolean}
 */
export function canUsePiP() {
  return canUsePiPInChrome() || canUsePiPInSafari();
}
/**
 * To detect autoplay, we create a video element and call play on it, if it is `paused` after
 * a `play()` call, autoplay is supported. Although this unintuitive, it works across browsers
 * and is currently the lightest way to detect autoplay without using a data source.
 *
 * @param {boolean} [muted=true]
 * @param {boolean} [playsinline=true]
 * @returns {Promise<boolean>}
 * @link https://github.com/ampproject/amphtml/blob/9bc8756536956780e249d895f3e1001acdee0bc0/src/utils/video.js#L25
 */
export function canAutoplay(muted = true, playsinline = true) {
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
  new Promise((resolve) => resolve(video.play())).catch(noop);
  return Promise.resolve(!video.paused);
}
