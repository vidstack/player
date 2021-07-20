/**
 * How likely it is that the current provider + browser will be able to play media of a given MIME
 * type.
 *
 * These enum values are unfortunate and I share your pain but we need to stay close to
 * browser standards. However, you can use the `shouldPlayType()` method on any provider
 * to get a simple `true`/`false` answer.
 *
 * @readonly
 * @enum {string}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType
 */
export const CanPlay = {
  /**
   * Media of the given type definitely can't be played on the current device.
   */
  No: '',
  /**
   * Not enough information is available to determine for sure whether or not the media will play
   * until playback is actually attempted.
   */
  Maybe: 'maybe',
  /**
   * Media of the type indicated by the `mediaType` parameter is probably playable on this device.
   */
  Probably: 'probably'
};
