import type { Src } from '../../core/api/src-types';
import { listen } from '../../utils/dom';

export function getCastFrameworkURL() {
  return 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
}

/**
 * Whether the Google Cast framework has loaded.
 */
export function hasLoadedCastFramework() {
  return !!window.cast?.framework;
}

/**
 * Whether Google Cast is available on this platform.
 */
export function isCastAvailable() {
  return !!window.chrome?.cast?.isAvailable;
}

/**
 * Whether the cast sender is connected.
 */
export function isCastConnected() {
  return getCastContext().getCastState() === cast.framework.CastState.CONNECTED;
}

/**
 * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
 */
export function getCastContext() {
  return window.cast.framework.CastContext.getInstance();
}

/**
 * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastSession}
 */
export function getCastSession() {
  return getCastContext().getCurrentSession();
}

/**
 * @see {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media.Media}
 */
export function getCastSessionMedia() {
  return getCastSession()?.getSessionObj().media[0];
}

export function hasActiveCastSession(src: Src | undefined | null) {
  const contentId = getCastSessionMedia()?.media.contentId;
  return contentId === src?.src;
}

/**
 * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastOptions}
 */
export function getDefaultCastOptions(): cast.framework.CastOptions {
  return {
    language: 'en-US',
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    resumeSavedSession: true,
    androidReceiverCompatible: true,
  };
}

export function getCastErrorMessage(code: chrome.cast.ErrorCode) {
  const defaultMessage = `Google Cast Error Code: ${code}`;

  if (__DEV__) {
    switch (code) {
      case chrome.cast.ErrorCode.API_NOT_INITIALIZED:
        return 'The API is not initialized.';
      case chrome.cast.ErrorCode.CANCEL:
        return 'The operation was canceled by the user';
      case chrome.cast.ErrorCode.CHANNEL_ERROR:
        return 'A channel to the receiver is not available.';
      case chrome.cast.ErrorCode.EXTENSION_MISSING:
        return 'The Cast extension is not available.';
      case chrome.cast.ErrorCode.INVALID_PARAMETER:
        return 'The parameters to the operation were not valid.';
      case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE:
        return 'No receiver was compatible with the session request.';
      case chrome.cast.ErrorCode.SESSION_ERROR:
        return 'A session could not be created, or a session was invalid.';
      case chrome.cast.ErrorCode.TIMEOUT:
        return 'The operation timed out.';
      default:
        return defaultMessage;
    }
  }

  return defaultMessage;
}

export function listenCastContextEvent<T extends keyof cast.framework.CastContextEvents>(
  type: T,
  handler: (event: cast.framework.CastContextEvents[T]) => void,
) {
  return listen(getCastContext(), type, handler);
}

export function listenCastSessionEvent<T extends keyof cast.framework.CastSessionEvents>(
  type: T,
  handler: (event: cast.framework.CastSessionEvents[T]) => void,
) {
  return listen(getCastSession(), type, handler);
}
