export type WebKitPresentationMode =
  | 'picture-in-picture'
  | 'inline'
  | 'fullscreen';

declare global {
  interface Document {
    // @ts-ignore
    pictureInPictureEnabled: boolean;
  }

  interface Window {
    chrome: boolean;
    safari: boolean;
    WebKitMediaSource: typeof MediaSource | undefined;
    WebKitSourceBuffer: typeof SourceBuffer | undefined;
  }

  interface HTMLMediaElement {
    captureStream?(): MediaStream;
  }

  interface HTMLVideoElement {
    disablePictureInPicture: boolean;

    /**
     * A Boolean value indicating whether the video is displaying in fullscreen mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1630493-webkitdisplayingfullscreen
     */
    readonly webkitDisplayingFullscreen?: boolean;

    /**
     * A Boolean value indicating whether the video can be played in fullscreen mode.
     *
     * `true` if the device supports fullscreen mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
     */
    readonly webkitSupportsFullscreen?: boolean;

    /**
     * A Boolean value indicating whether wireless video playback is disabled.
     */
    readonly webkitWirelessVideoPlaybackDisabled?: boolean;

    /**
     * A property indicating the presentation mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
     */
    readonly webkitPresentationMode?: WebKitPresentationMode;

    /**
     * Enters fullscreen mode.
     *
     * This method throws an exception if the element is not allowed to enter fullscreen—that is,
     * if `webkitSupportsFullscreen` is false.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
     */
    webkitEnterFullscreen?(): void;

    /**
     * Exits fullscreen mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629468-webkitexitfullscreen
     */
    webkitExitFullscreen?(): void;

    /**
     * A Boolean value indicating whether the video can be played in presentation mode.
     *
     * `true` if the device supports presentation mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629816-webkitsupportspresentationmode
     */
    webkitSupportsPresentationMode?(mode: WebKitPresentationMode): boolean;

    /**
     * Sets the presentation mode for video playback.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631224-webkitsetpresentationmode
     */
    webkitSetPresentationMode?(mode: WebKitPresentationMode): Promise<void>;
  }

  interface FormDataEvent extends Event {
    /**
     * Returns a FormData object representing names and values of elements associated to the target
     * form. Operations on the FormData object will affect form data to be submitted.
     */
    readonly formData: FormData;
  }

  interface PictureInPictureWindowEventMap {
    resize: Event;
  }

  interface PictureInPictureWindow extends EventTarget {
    readonly height: number;
    onresize: ((this: PictureInPictureWindow, ev: Event) => any) | null;
    readonly width: number;
    addEventListener<K extends keyof PictureInPictureWindowEventMap>(
      type: K,
      listener: (
        this: PictureInPictureWindow,
        ev: PictureInPictureWindowEventMap[K]
      ) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof PictureInPictureWindowEventMap>(
      type: K,
      listener: (
        this: PictureInPictureWindow,
        ev: PictureInPictureWindowEventMap[K]
      ) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}
