export type Constructor<T = Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

export type Separator = ' ' | '-' | '_';

export type CamelCase<
  T extends string
> = T extends `${Separator}${infer Suffix}`
  ? CamelCase<Suffix>
  : T extends `${infer Prefix}${Separator}`
  ? CamelCase<Prefix>
  : T extends `${infer Prefix}${Separator}${infer Suffix}`
  ? CamelCase<`${Prefix}${Capitalize<Suffix>}`>
  : T;

export type PascalCase<T extends string> = Capitalize<CamelCase<T>>;

export type MethodsOnly<T> = Omit<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T]
>;

export type Callback<T> = (value: T) => void;

export type Unsubscribe = () => void;

export interface Cancelable {
  cancel(): void;
}

export type CancelableCallback<T> = Callback<T> & Cancelable;

export type WebKitPresentationMode =
  | 'picture-in-picture'
  | 'inline'
  | 'fullscreen';

declare global {
  interface Document {
    pictureInPictureEnabled: boolean;
  }

  interface Window {
    chrome: boolean;
    safari: boolean;
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
}

// V8ToIstanbul fails when no value is exported.
export default class {}
