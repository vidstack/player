export type MediaErrorDetail = {
  message: string;
  code: MediaErrorCode;
  mediaError?: MediaError;
};

/**
 * A number which represents the general type of error that occurred.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaError
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
 */
export enum MediaErrorCode {
  /**
   * The fetching of the associated resource was aborted by the user's request.
   */
  Aborted = 1,
  /**
   * Some kind of network error occurred which prevented the media from being successfully
   * fetched, despite having previously been available.
   */
  Network = 2,
  /**
   * Despite having previously been determined to be usable, an error occurred while trying to
   * decode the media resource, resulting in an error.
   */
  Decode = 3,
  /**
   * The associated resource or media provider object (such as a `MediaStream`) has been found to
   * be unsuitable.
   */
  SrcNotSupported = 4
}
