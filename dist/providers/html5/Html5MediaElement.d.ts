/**
 * A DOMString` indicating the `CORS` setting for this media element.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 * @typedef {'anonymous' | 'use-credentials'} MediaCrossOriginOption
 */
/**
 * Is a `DOMString` that reflects the `preload` HTML attribute, indicating what data should be
 * preloaded, if any.
 *
 * @typedef {'none' | 'metadata' | 'auto'} MediaPreloadOption
 */
/**
 * `DOMTokenList` that helps the user agent select what controls to show on the media element
 * whenever the user agent shows its own set of controls. The `DOMTokenList` takes one or more of
 * three possible values: `nodownload`, `nofullscreen`, and `noremoteplayback`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
 * @typedef {'nodownload'
 *  | 'nofullscreen'
 *  | 'noremoteplayback'
 *  | 'nodownload nofullscreen'
 *  | 'nodownload noremoteplayback'
 *  | 'nofullscreen noremoteplayback'
 *  | 'nodownload nofullscreen noremoteplayback'
 * } MediaControlsList
 */
/**
 * The object which serves as the source of the media associated with the `HTMLMediaElement`. The
 * object can be a `MediaStream`, `MediaSource`, `Blob`, or `File` (which inherits from `Blob`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaSource
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * @link https://developer.mozilla.org/en-US/docs/Web/API/File
 * @typedef {MediaStream | MediaSource | Blob | File} MediaSrcObject
 */
/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Html5MediaElement extends MediaProviderElement {
    /**
     * The height of the media player.
     *
     * @type {number | undefined}
     */
    height: number | undefined;
    /**
     * Determines what controls to show on the media element whenever the browser shows its own set
     * of controls (e.g. when the controls attribute is specified).
     *
     * @example 'nodownload nofullscreen noremoteplayback'
     * @type {MediaControlsList}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
     */
    controlsList: MediaControlsList;
    /**
     * Whether to use CORS to fetch the related image. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
     * information.
     *
     * @type {MediaCrossOriginOption}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin
     */
    crossOrigin: MediaCrossOriginOption;
    /**
     * Reflects the muted attribute, which indicates whether the audio output should be muted by
     * default.  This property has no dynamic effect. To mute and unmute the audio output, use
     * the `muted` property.
     *
     * @type {boolean | undefined}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultMuted
     */
    defaultMuted: boolean | undefined;
    /**
     * A `double` indicating the default playback rate for the media.
     *
     * @type {number | undefined}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultPlaybackRate
     */
    defaultPlaybackRate: number | undefined;
    /**
     *  Whether to disable the capability of remote playback in devices that are
     * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
     * DLNA, AirPlay, etc).
     *
     * @type {boolean | undefined}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/disableRemotePlayback
     * @see https://www.w3.org/TR/remote-playback/#the-disableremoteplayback-attribute
     */
    disableRemotePlayback: boolean | undefined;
    /**
     * Provides a hint to the browser about what the author thinks will lead to the best user
     * experience with regards to what content is loaded before the video is played. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
     * information.
     *
     * @type {MediaPreloadOption | undefined}
     */
    preload: MediaPreloadOption | undefined;
    /**
     * The width of the media player.
     *
     * @type {number | undefined}
     */
    width: number | undefined;
    /**
     * @protected
     * @type {string}
     */
    protected _src: string;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLMediaElement>}
     */
    protected readonly mediaRef: import('lit/directives/ref').Ref<HTMLMediaElement>;
    /** @type {HTMLMediaElement} */
    get mediaElement(): HTMLMediaElement;
    set src(arg: string);
    /**
     * The URL of a media resource to use.
     *
     * @type {string}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
     */
    get src(): string;
    set srcObject(arg: MediaSrcObject | undefined);
    /**
     * Sets or returns the object which serves as the source of the media associated with the
     * `HTMLMediaElement`.
     *
     * @type {MediaSrcObject | undefined}
     * @default undefined
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
     */
    get srcObject(): MediaSrcObject | undefined;
    /**
     * Indicates the readiness state of the media.
     *
     * @type {MediaReadyState}
     * @default ReadyState.HaveNothing
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
     */
    get readyState(): number;
    /**
     * Indicates the current state of the fetching of media over the network.
     *
     * @type {MediaNetworkState}
     * @default NetworkState.Empty
     */
    get networkState(): number;
    /**
     * Override this to modify the content rendered inside `<audio>` and `<video>` elements.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderMediaChildren(): import('lit').TemplateResult;
    /**
     * @protected
     * @type {number}
     */
    protected timeRAF: number;
    /**
     * @protected
     */
    protected cancelTimeUpdates(): void;
    /**
     * @protected
     */
    protected requestTimeUpdates(): void;
    /**
     * @protected
     */
    protected handleDefaultSlotChange(): void;
    /**
     * @protected
     */
    protected cleanupOldSourceNodes(): void;
    /**
     * @protected
     */
    protected attachNewSourceNodes(): void;
    /**
     * @protected
     */
    protected bindMediaEventListeners(): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleAbort(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleCanPlay(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleCanPlayThrough(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleLoadStart(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleEmptied(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleLoadedData(event: Event): void;
    /**
     * Can be used to indicate another engine such as `hls.js` will attach to the media element
     * so it can handle certain ready events.
     *
     * @protected
     * @returns {boolean}
     */
    protected willAnotherEngineAttach(): boolean;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleLoadedMetadata(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handlePlay(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handlePause(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handlePlaying(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleDurationChange(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleProgress(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleRateChange(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleSeeked(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleSeeking(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleStalled(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleTimeUpdate(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleVolumeChange(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleWaiting(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleSuspend(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleEnded(event: Event): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleError(event: Event): void;
    /**
     * 🧑‍🔬 **EXPERIMENTAL:** Returns a `MediaStream` object which is streaming a real-time capture
     * of the content being rendered in the media element. This method will return `undefined`
     * if this API is not available.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream
     * @returns {MediaStream | undefined}
     */
    captureStream(): MediaStream | undefined;
    /**
     * Resets the media element to its initial state and begins the process of selecting a media
     * source and loading the media in preparation for playback to begin at the beginning. The
     * amount of media data that is prefetched is determined by the value of the element's
     * `preload` attribute.
     *
     * ⚠️ **IMPORTANT:** You should generally not need to call this method as it's handled by
     * the library.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
     */
    load(): void;
}
/**
 * A DOMString` indicating the `CORS` setting for this media element.
 */
export type MediaCrossOriginOption = 'anonymous' | 'use-credentials';
/**
 * Is a `DOMString` that reflects the `preload` HTML attribute, indicating what data should be
 * preloaded, if any.
 */
export type MediaPreloadOption = 'none' | 'metadata' | 'auto';
/**
 * `DOMTokenList` that helps the user agent select what controls to show on the media element
 * whenever the user agent shows its own set of controls. The `DOMTokenList` takes one or more of
 * three possible values: `nodownload`, `nofullscreen`, and `noremoteplayback`.
 */
export type MediaControlsList = 'nodownload' | 'nofullscreen' | 'noremoteplayback' | 'nodownload nofullscreen' | 'nodownload noremoteplayback' | 'nofullscreen noremoteplayback' | 'nodownload nofullscreen noremoteplayback';
/**
 * The object which serves as the source of the media associated with the `HTMLMediaElement`. The
 * object can be a `MediaStream`, `MediaSource`, `Blob`, or `File` (which inherits from `Blob`).
 */
export type MediaSrcObject = MediaStream | MediaSource | Blob | File;
import { MediaProviderElement } from "../../media/provider/MediaProviderElement.js";
