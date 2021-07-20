/**
 * Returns the current version of Safari. Defaults to `0` if unknown.
 *
 * @returns {number}
 */
export function currentSafariVersion(): number;
/**
 * Checks if a video player can enter fullscreen.
 *
 * @returns {boolean}
 * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
 */
export function canFullscreenVideo(): boolean;
/**
 * Checks whether the `IntersectionObserver` API is available.
 *
 * @returns {boolean}
 */
export function canObserveIntersection(): boolean;
/**
 * Checks if the ScreenOrientation API is available.
 *
 * @returns {boolean}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export function canOrientScreen(): boolean;
/**
 * Checks if the screen orientation can be changed.
 *
 * @returns {boolean}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
export function canRotateScreen(): boolean;
/**
 * Reduced motion iOS & MacOS setting.
 *
 * @returns {boolean}
 * @link https://webkit.org/blog/7551/responsive-design-for-motion/
 */
export function isReducedMotionPreferred(): boolean;
/**
 * Checks if the native HTML5 video player can play HLS.
 *
 * @returns {boolean}
 */
export function canPlayHLSNatively(): boolean;
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @returns {boolean}
 * @link  https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
 */
export function canUsePiPInChrome(): boolean;
/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @returns {boolean}
 * @link https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */
export function canUsePiPInSafari(): boolean;
/**
 * Checks if the native HTML5 video player can enter PIP.
 *
 * @returns {boolean}
 */
export function canUsePiP(): boolean;
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
export function canAutoplay(muted?: boolean | undefined, playsinline?: boolean | undefined): Promise<boolean>;
export const IS_CLIENT: boolean;
export const UA: string;
export const IS_IOS: boolean;
export const IS_ANDROID: boolean;
export const IS_MOBILE: boolean;
export const IS_IPHONE: boolean;
export const IS_FIREFOX: boolean;
export const IS_CHROME: boolean;
export const IS_SAFARI: boolean;
export const ORIGIN: string | undefined;
