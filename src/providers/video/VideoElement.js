import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';

import {
	MediaType,
	VDS_MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES,
	VdsMediaTypeChangeEvent,
	VdsViewTypeChangeEvent,
	ViewType
} from '../../media/index.js';
import { ifNonEmpty } from '../../shared/directives/if-non-empty.js';
import { ifNumber } from '../../shared/directives/if-number.js';
import { StorybookControlType } from '../../shared/storybook/index.js';
import { Html5MediaElement } from '../html5/index.js';
import { videoElementStyles } from './css.js';
import { VideoFullscreenController } from './fullscreen/index.js';
import { VideoPresentationController } from './presentation/index.js';

export const VDS_VIDEO_ELEMENT_TAG_NAME = 'vds-video';

export const AUDIO_EXTENSIONS =
	/\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;

/** @typedef {import('./types').VideoProvider} VideoProvider */

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @implements {VideoProvider}
 *
 * @tagname vds-video
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 *
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 *
 * @example
 * ```html
 * <vds-video src="/media/video.mp4" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-video>
 * ```
 *
 * @example
 * ```html
 * <vds-video poster="/media/poster.png">
 *   <source src="/media/video.mp4" type="video/mp4" />
 *   <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 * </vds-video>
 * ```
 */
export class VideoElement extends Html5MediaElement {
	/** @type {import('lit').CSSResultGroup} */
	static get styles() {
		return [videoElementStyles];
	}

	/** @type {string[]} */
	static get parts() {
		return ['root', 'video'];
	}

	constructor() {
		super();

		/** @type {boolean | undefined} */
		this.autoPiP;
		/** @type {boolean | undefined} */
		this.disablePiP;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			poster: {},
			autoPiP: { type: Boolean, attribute: 'autopictureinpicture' },
			disablePiP: { type: Boolean, attribute: 'disablepictureinpicture' }
		};
	}

	/** @type {string} */
	get poster() {
		return this.context.currentPoster;
	}

	set poster(newPoster) {
		this.connectedQueue.queue('currentPoster', () => {
			this.context.currentPoster = newPoster;
			this.requestUpdate();
		});
	}

	/** @type {HTMLVideoElement} */
	get mediaElement() {
		return /** @type {HTMLVideoElement} */ (this.mediaRef.value);
	}

	get videoElement() {
		return /** @type {HTMLVideoElement} */ (this.mediaRef.value);
	}

	get engine() {
		return this.mediaElement;
	}

	get videoEngine() {
		return this.videoElement;
	}

	// -------------------------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------------------------

	connectedCallback() {
		super.connectedCallback();

		this.context.viewType = ViewType.Video;
		this.dispatchEvent(
			new VdsViewTypeChangeEvent({
				detail: ViewType.Video
			})
		);
	}

	// -------------------------------------------------------------------------------------------
	// Render
	// -------------------------------------------------------------------------------------------

	/** @returns {import('lit').TemplateResult} */
	render() {
		return html`
			<div
				id="root"
				class="${this.getRootClassAttr()}"
				part="${this.getRootPartAttr()}"
			>
				${this.renderVideo()}
			</div>
		`;
	}

	/**
	 * Override this to modify root provider CSS Classes.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootClassAttr() {
		return '';
	}

	/**
	 * Override this to modify root provider CSS Parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootPartAttr() {
		return 'root';
	}

	/**
	 * Override this to modify video CSS Parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getVideoPartAttr() {
		return 'video';
	}

	/**
	 * Can be used by attaching engine such as `hls.js` to prevent src attr being set on
	 * `<video>` element.
	 *
	 * @protected
	 * @returns {boolean}
	 */
	shouldSetVideoSrcAttr() {
		return true;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderVideo() {
		return html`
			<video
				part="${this.getVideoPartAttr()}"
				src="${ifNonEmpty(this.shouldSetVideoSrcAttr() ? this.src : '')}"
				width="${ifNumber(this.width)}"
				height="${ifNumber(this.height)}"
				poster="${ifDefined(this.poster)}"
				preload="${ifNonEmpty(this.preload)}"
				crossorigin="${ifNonEmpty(this.crossOrigin)}"
				controlslist="${ifNonEmpty(this.controlsList)}"
				?autoplay="${this.autoplay}"
				?loop="${this.loop}"
				?playsinline="${this.playsinline}"
				?controls="${this.controls}"
				?autopictureinpicture="${this.autoPiP}"
				?disablepictureinpicture="${this.disablePiP}"
				?disableremoteplayback="${this.disableRemotePlayback}"
				.defaultMuted="${this.defaultMuted ?? this.muted}"
				.defaultPlaybackRate="${this.defaultPlaybackRate ?? 1}"
				${ref(this.mediaRef)}
			>
				${this.renderMediaChildren()}
			</video>
		`;
	}

	// -------------------------------------------------------------------------------------------
	// Events
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	handleLoadedMetadata(event) {
		this.context.mediaType = this.getMediaType();
		this.dispatchEvent(
			new VdsMediaTypeChangeEvent({
				detail: this.context.mediaType,
				originalEvent: event
			})
		);

		super.handleLoadedMetadata(event);
	}

	// -------------------------------------------------------------------------------------------
	// Methods
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @returns {MediaType}
	 */
	getMediaType() {
		if (AUDIO_EXTENSIONS.test(this.currentSrc)) {
			return MediaType.Audio;
		}

		if (VIDEO_EXTENSIONS.test(this.currentSrc)) {
			return MediaType.Video;
		}

		return MediaType.Unknown;
	}

	// -------------------------------------------------------------------------------------------
	// Fullscreen
	// -------------------------------------------------------------------------------------------

	presentationController = new VideoPresentationController(this);

	fullscreenController = new VideoFullscreenController(
		this,
		this.screenOrientationController,
		this.presentationController
	);
}

/**
 * @readonly
 * @type {import('./types.js').VideoElementStorybookArgTypes}
 */
export const VDS_VIDEO_ELEMENT_STORYBOOK_ARG_TYPES = {
	...VDS_MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES,
	autoPiP: { control: StorybookControlType.Boolean },
	controlsList: { control: StorybookControlType.Text },
	crossOrigin: { control: StorybookControlType.Text },
	defaultMuted: { control: StorybookControlType.Boolean },
	defaultPlaybackRate: { control: StorybookControlType.Number },
	disablePiP: { control: StorybookControlType.Boolean },
	disableRemotePlayback: { control: StorybookControlType.Boolean },
	height: { control: StorybookControlType.Number },
	poster: {
		control: StorybookControlType.Text,
		defaultValue: 'https://media-files.vidstack.io/poster.png'
	},
	preload: { control: StorybookControlType.Text },
	src: {
		control: StorybookControlType.Text,
		defaultValue:
			'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4'
	},
	srcObject: { control: StorybookControlType.Text },
	width: { control: StorybookControlType.Number }
};
