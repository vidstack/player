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
