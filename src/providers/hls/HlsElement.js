import Hls from 'hls.js';

import {
	CanPlay,
	MediaType,
	VdsDurationChangeEvent,
	VdsErrorEvent,
	VdsMediaTypeChangeEvent
} from '../../media';
import { VdsCustomEvent } from '../../shared/events';
import { isNil, isUndefined } from '../../utils/unit';
import { VideoElement } from '../video';
import { HLS_EXTENSIONS, HLS_TYPES } from './constants';
import {
	VdsHlsEngineAttachEvent,
	VdsHlsEngineBuiltEvent,
	VdsHlsEngineDetachEvent,
	VdsHlsEngineNoSupportEvent
} from './events';

/** @typedef {import('./types').HlsProvider} IHlsProvider */

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS) via the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library.
 *
 * You'll need to install `hls.js` to use this provider...
 *
 * ```bash
 * $: npm install hls.js@^0.14.0
 * ```
 *
 * @implements {IHlsProvider}
 *
 * @tagname vds-hls
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 *
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-hls>
 * ```
 *
 * @example
 * ```html
 *  <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-hls>
 * ```
 */
export class HlsElement extends VideoElement {
	constructor() {
		super();

		/** @type {Hls.Config | undefined} */
		this.hlsConfig;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			hlsConfig: { type: Object, attribute: 'hls-config' }
		};
	}

	/**
	 * @protected
	 * @type {Hls | undefined}
	 */
	_hlsEngine;

	/**
	 * @protected
	 * @type {boolean}
	 */
	_isHlsEngineAttached = false;

	get hlsEngine() {
		return this._hlsEngine;
	}

	get videoEngine() {
		return this.videoElement;
	}

	get isHlsEngineAttached() {
		return this._isHlsEngineAttached;
	}

	get currentSrc() {
		return this.isCurrentlyHls && !this.shouldUseNativeHlsSupport
			? this.src
			: this.videoEngine?.currentSrc ?? '';
	}

	// -------------------------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------------------------

	connectedCallback() {
		super.connectedCallback();
		this.handleMediaSrcChange();
	}

	firstUpdated(changedProps) {
		super.firstUpdated(changedProps);
		this.handleMediaSrcChange();
	}

	disconnectedCallback() {
		this.destroyHlsEngine();
		super.disconnectedCallback();
	}

	// -------------------------------------------------------------------------------------------
	// Methods
	// -------------------------------------------------------------------------------------------

	/**
	 * @param {string} type
	 * @returns {CanPlay}
	 */
	canPlayType(type) {
		if (HLS_TYPES.has(type)) {
			return Hls.isSupported() ? CanPlay.Probably : CanPlay.Maybe;
		}

		return super.canPlayType(type);
	}

	get isCurrentlyHls() {
		return HLS_EXTENSIONS.test(this.src);
	}

	get hasNativeHlsSupport() {
		/**
		 * We need to call this directly on `HTMLMediaElement`, calling `this.shouldPlayType(...)`
		 * won't work here because it'll use the `CanPlayType` result from this provider override
		 * which will incorrectly indicate that HLS can natively played due to `hls.js` support.
		 */
		const canPlayType = super.canPlayType('application/vnd.apple.mpegurl');
		return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
	}

	get shouldUseNativeHlsSupport() {
		if (Hls.isSupported()) return false;
		return this.hasNativeHlsSupport;
	}

	/**
	 * @protected
	 * @returns {boolean}
	 */
	shouldSetVideoSrcAttr() {
		return this.shouldUseNativeHlsSupport || !this.isCurrentlyHls;
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	destroyHlsEngine() {
		this.hlsEngine?.destroy();
		this._prevHlsSrc = '';
		this._isHlsEngineAttached = false;
		this.context.canPlay = false;
	}

	/** @type {string} */
	_prevHlsSrc = '';

	/**
	 * @protected
	 * @returns {void}
	 */
	loadSrcOnHlsEngine() {
		if (
			isNil(this.hlsEngine) ||
			!this.isCurrentlyHls ||
			this.shouldUseNativeHlsSupport ||
			this.src === this._prevHlsSrc
		)
			return;

		this.hlsEngine.loadSource(this.src);
		this._prevHlsSrc = this.src;
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	buildHlsEngine() {
		if (isNil(this.videoEngine) || !isUndefined(this.hlsEngine)) return;

		if (!Hls.isSupported()) {
			this.dispatchEvent(new VdsHlsEngineNoSupportEvent());
			return;
		}

		this._hlsEngine = new Hls(this.hlsConfig ?? {});
		this.dispatchEvent(new VdsHlsEngineBuiltEvent({ detail: this.hlsEngine }));
		this.listenToHlsEngine();
	}

	/**
	 * @protected
	 * @returns {boolean}
	 */
	// Let `Html5MediaElement` know we're taking over ready events.
	willAnotherEngineAttach() {
		return this.isCurrentlyHls && !this.shouldUseNativeHlsSupport;
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	attachHlsEngine() {
		if (
			this.isHlsEngineAttached ||
			isUndefined(this.hlsEngine) ||
			isNil(this.videoEngine)
		)
			return;

		this.hlsEngine.attachMedia(this.videoEngine);
		this._isHlsEngineAttached = true;
		this.dispatchEvent(new VdsHlsEngineAttachEvent({ detail: this.hlsEngine }));
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	detachHlsEngine() {
		if (!this.isHlsEngineAttached) return;
		this.hlsEngine?.detachMedia();
		this._isHlsEngineAttached = false;
		this._prevHlsSrc = '';
		this.dispatchEvent(new VdsHlsEngineDetachEvent({ detail: this.hlsEngine }));
	}

	/**
	 * @protected
	 * @returns {MediaType}
	 */
	getMediaType() {
		if (this.isCurrentlyHls) {
			return MediaType.Video;
		}

		return super.getMediaType();
	}

	// -------------------------------------------------------------------------------------------
	// Events
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @returns {void}
	 */
	handleMediaSrcChange() {
		super.handleMediaSrcChange();

		this.context.canPlay = false;

		if (!this.isCurrentlyHls) {
			this.detachHlsEngine();
			return;
		}

		// Need to wait for `src` attribute on `<video>` to clear if last `src` was not using
		// HLS engine.
		window.requestAnimationFrame(async () => {
			await this.requestUpdate();

			if (isUndefined(this.hlsEngine)) {
				this.buildHlsEngine();
			}

			this.attachHlsEngine();
			this.loadSrcOnHlsEngine();
		});
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	listenToHlsEngine() {
		if (isUndefined(this.hlsEngine)) return;
		this.hlsEngine.on(
			Hls.Events.LEVEL_LOADED,
			this.handleHlsLevelLoaded.bind(this)
		);
		this.hlsEngine.on(Hls.Events.ERROR, this.handleHlsError.bind(this));
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.errorData} data
	 * @returns {void}
	 */
	handleHlsError(eventType, data) {
		this.context.error = data;

		if (data.fatal) {
			switch (data.type) {
				case Hls.ErrorTypes.NETWORK_ERROR:
					this.handleHlsNetworkError(eventType, data);
					break;
				case Hls.ErrorTypes.MEDIA_ERROR:
					this.handleHlsMediaError(eventType, data);
					break;
				default:
					this.handleHlsIrrecoverableError(eventType, data);
					break;
			}
		}

		this.dispatchEvent(
			new VdsErrorEvent({
				originalEvent: new VdsCustomEvent(eventType, { detail: data })
			})
		);
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.errorData} data
	 * @returns {void}
	 */
	handleHlsNetworkError(eventType, data) {
		this.hlsEngine?.startLoad();
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.errorData} data
	 * @returns {void}
	 */
	handleHlsMediaError(eventType, data) {
		this.hlsEngine?.recoverMediaError();
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.errorData} data
	 * @returns {void}
	 */
	handleHlsIrrecoverableError(eventType, data) {
		this.destroyHlsEngine();
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.levelLoadedData} data
	 * @returns {void}
	 */
	handleHlsLevelLoaded(eventType, data) {
		if (this.context.canPlay) return;
		this.handleHlsMediaReady(eventType, data);
	}

	/**
	 * @protected
	 * @param {string} eventType
	 * @param {Hls.levelLoadedData} data
	 * @returns {void}
	 */
	handleHlsMediaReady(eventType, data) {
		const { live, totalduration: duration } = data.details;

		const originalEvent = new VdsCustomEvent(eventType, { detail: data });

		const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
		if (this.context.mediaType !== mediaType) {
			this.context.mediaType = mediaType;
			this.dispatchEvent(
				new VdsMediaTypeChangeEvent({ detail: mediaType, originalEvent })
			);
		}

		if (this.context.duration !== duration) {
			this.context.duration = duration;
			this.dispatchEvent(
				new VdsDurationChangeEvent({ detail: duration, originalEvent })
			);
		}

		this.handleMediaReady(originalEvent);
	}
}
