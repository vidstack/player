import { MediaProviderElementProps } from '../../media/index.js';
import { MediaNetworkState } from './MediaNetworkState.js';
import { MediaReadyState } from './MediaReadyState.js';

/**
 * A DOMString` indicating the `CORS` setting for this media element.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
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
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
 */
export type MediaControlsList =
	| 'nodownload'
	| 'nofullscreen'
	| 'noremoteplayback'
	| 'nodownload nofullscreen'
	| 'nodownload noremoteplayback'
	| 'nofullscreen noremoteplayback'
	| 'nodownload nofullscreen noremoteplayback';

/**
 * The object which serves as the source of the media associated with the `HTMLMediaElement`. The
 * object can be a `MediaStream`, `MediaSource`, `Blob`, or `File` (which inherits from `Blob`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaSource
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * @link https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export type MediaSrcObject = MediaStream | MediaSource | Blob | File;

export interface Html5MediaElementProps extends MediaProviderElementProps {
	/**
	 * Determines what controls to show on the media element whenever the browser shows its own set
	 * of controls (e.g. when the controls attribute is specified).
	 *
	 * @example 'nodownload nofullscreen noremoteplayback'
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
	 */
	controlsList?: MediaControlsList;

	/**
	 * Whether to use CORS to fetch the related image. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
	 * information.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin
	 */
	crossOrigin?: MediaCrossOriginOption;

	/**
	 * Reflects the muted attribute, which indicates whether the audio output should be muted by
	 * default.  This property has no dynamic effect. To mute and unmute the audio output, use
	 * the `muted` property.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultMuted
	 */
	defaultMuted?: boolean;

	/**
	 * A `double` indicating the default playback rate for the media.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultPlaybackRate
	 */
	defaultPlaybackRate?: number;

	/**
	 *  Whether to disable the capability of remote playback in devices that are
	 * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
	 * DLNA, AirPlay, etc).
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/disableRemotePlayback
	 * @spec https://www.w3.org/TR/remote-playback/#the-disableremoteplayback-attribute
	 */
	disableRemotePlayback?: boolean;

	/**
	 * Returns a `MediaError` object for the most recent error, or `undefined` if there has not been
	 * an error.
	 *
	 * @default undefined
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
	 */
	readonly error: MediaError | undefined;

	readonly engine: HTMLMediaElement;

	/**
	 * The height of the media player.
	 */
	height?: number;

	/**
	 * Indicates the current state of the fetching of media over the network.
	 *
	 * @default NetworkState.Empty
	 */
	readonly networkState: MediaNetworkState;

	/**
	 * Provides a hint to the browser about what the author thinks will lead to the best user
	 * experience with regards to what content is loaded before the video is played. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
	 * information.
	 */
	preload?: MediaPreloadOption;

	/**
	 * Indicates the readiness state of the media.
	 *
	 * @default ReadyState.HaveNothing
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
	 */
	readonly readyState: MediaReadyState;

	/**
	 * The URL of a media resource to use.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
	 */
	src: string;

	/**
	 * Sets or returns the object which serves as the source of the media associated with the
	 * `HTMLMediaElement`.
	 *
	 * @default undefined
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
	 */
	srcObject?: MediaSrcObject;

	/**
	 * The width of the media player.
	 */
	width?: number;
}

export interface Html5MediaElementMethods {
	/**
	 * 🧑‍🔬 **EXPERIMENTAL:** Returns a `MediaStream` object which is streaming a real-time capture
	 * of the content being rendered in the media element. This method will return `undefined`
	 * if this API is not available.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream
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

export type Html5MediaProvider = Html5MediaElementProps &
	Html5MediaElementMethods;
