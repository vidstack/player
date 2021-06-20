import { html } from 'lit';

import { provideContextRecord } from '../../shared/context/index.js';
import { VdsElement } from '../../shared/elements/index.js';
import { bindEventListeners } from '../../shared/events/index.js';
import { isNil } from '../../utils/unit.js';
import {
	MediaContainerElement,
	VdsMediaContainerConnectEvent
} from '../container/index.js';
import { createMediaContextRecord, mediaContext } from '../media.context.js';
import {
	VdsEnterFullscreenRequestEvent,
	VdsExitFullscreenRequestEvent,
	VdsMuteRequestEvent,
	VdsPauseRequestEvent,
	VdsPlayRequestEvent,
	VdsSeekRequestEvent,
	VdsUnmuteRequestEvent,
	VdsVolumeChangeRequestEvent
} from '../media-request.events.js';
import {
	MediaProviderElement,
	VdsMediaProviderConnectEvent
} from '../provider/index.js';
import { mediaControllerStyles } from './css.js';

export const VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components. The two primary responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * @tagname vds-media-controller
 *
 * @slot Used to pass in components that use/manage media state.
 *
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *       slot="media"
 *     >
 *       <!-- ... -->
 *     </vds-video>
 *
 *     <!-- UI components here. -->
 *   </vds-media-container>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media-controller>
 * ```
 */
export class MediaControllerElement extends VdsElement {
	/** @type {import('@lit/reactive-element').CSSResultGroup} */
	static get styles() {
		return [mediaControllerStyles];
	}

	// -------------------------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------------------------

	connectedCallback() {
		super.connectedCallback();
		this.bindEventListeners();
	}

	// -------------------------------------------------------------------------------------------
	// Event Bindings
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @returns {void}
	 */
	bindEventListeners() {
		const events = {
			[VdsMediaContainerConnectEvent.TYPE]: this.handleMediaContainerConnect,
			[VdsMediaProviderConnectEvent.TYPE]: this.handleMediaProviderConnect,
			[VdsMuteRequestEvent.TYPE]: this.handleMuteRequest,
			[VdsUnmuteRequestEvent.TYPE]: this.handleUnmuteRequest,
			[VdsPlayRequestEvent.TYPE]: this.handlePlayRequest,
			[VdsPauseRequestEvent.TYPE]: this.handlePauseRequest,
			[VdsSeekRequestEvent.TYPE]: this.handleSeekRequest,
			[VdsVolumeChangeRequestEvent.TYPE]: this.handleVolumeChangeRequest,
			[VdsEnterFullscreenRequestEvent.TYPE]: this.handleEnterFullscreenRequest,
			[VdsExitFullscreenRequestEvent.TYPE]: this.handleExitFullscreenRequest
		};

		bindEventListeners(this, events, this.disconnectDisposal);
	}

	// -------------------------------------------------------------------------------------------
	// Context
	// -------------------------------------------------------------------------------------------

	/**
	 * The media context record. Any property updated inside this object will trigger a context
	 * update that will flow down to all consumer components. This record is injected into a
	 * a media provider element (see `handleMediaProviderConnect`) as it's responsible for managing
	 * it (ie: updating context properties).
	 *
	 * @readonly
	 * @internal Exposed for testing.
	 */
	context = provideContextRecord(this, mediaContext);

	// -------------------------------------------------------------------------------------------
	// Render
	// -------------------------------------------------------------------------------------------

	render() {
		return html`<slot></slot>`;
	}

	// -------------------------------------------------------------------------------------------
	// Media Container
	// -------------------------------------------------------------------------------------------

	/**
	 * @private
	 * @type {MediaContainerElement | undefined}
	 */
	_mediaContainer;

	/**
	 * The current media container that belongs to this controller. Defaults to `undefined` if
	 * there is none.
	 *
	 * @returns {MediaContainerElement | undefined}
	 */
	get mediaContainer() {
		return this._mediaContainer;
	}

	/**
	 * @protected
	 * @param {VdsMediaContainerConnectEvent} event
	 * @returns {void}
	 */
	handleMediaContainerConnect(event) {
		const { container, onDisconnect } = event.detail;
		this._mediaContainer = container;
		onDisconnect(() => {
			this._mediaContainer = undefined;
		});
	}

	// -------------------------------------------------------------------------------------------
	// Media Provider
	// -------------------------------------------------------------------------------------------

	/**
	 * @private
	 * @type {MediaProviderElement | undefined}
	 */
	_mediaProvider;

	/**
	 * The current media provider that belongs to this controller. Defaults to `undefined` if there
	 * is none.
	 *
	 * @type {MediaProviderElement | undefined}
	 */
	get mediaProvider() {
		return this._mediaProvider;
	}

	/**
	 * @protected
	 * @param {VdsMediaProviderConnectEvent} event
	 * @returns {void}
	 */
	handleMediaProviderConnect(event) {
		const { provider, onDisconnect } = event.detail;
		this._mediaProvider = provider;
		// Bypass readonly `context`.
		// We are injecting our context object into the `MediaProviderElement` so it can be managed by it.
		/** @type {any} */ (this._mediaProvider).context = this.context;
		onDisconnect(() => {
			// Bypass readonly `context`.
			/** @type {any} */ (this._mediaProvider).context =
				createMediaContextRecord();
			this._mediaProvider = undefined;
		});
	}

	// -------------------------------------------------------------------------------------------
	// Media Request Events
	// -------------------------------------------------------------------------------------------

	/**
	 * Override this to allow media events to bubble up the DOM.
	 *
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	mediaRequestEventGateway(event) {
		event.stopPropagation();
	}

	/**
	 * @protected
	 * @param {VdsMuteRequestEvent} event
	 * @returns {void}
	 */
	handleMuteRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.muted = true;
		}
	}

	/**
	 * @protected
	 * @param {VdsUnmuteRequestEvent} event
	 * @returns {void}
	 */
	handleUnmuteRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.muted = false;
		}
	}

	/**
	 * @protected
	 * @param {VdsPlayRequestEvent} event
	 * @returns {void}
	 */
	handlePlayRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.paused = false;
		}
	}

	/**
	 * @protected
	 * @param {VdsPauseRequestEvent} event
	 * @returns {void}
	 */
	handlePauseRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.paused = true;
		}
	}

	/**
	 * @protected
	 * @param {VdsSeekRequestEvent} event
	 * @returns {void}
	 */
	handleSeekRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.currentTime = event.detail;
		}
	}

	/**
	 * @protected
	 * @param {VdsVolumeChangeRequestEvent} event
	 * @returns {void}
	 */
	handleVolumeChangeRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaProvider)) {
			this.mediaProvider.volume = event.detail;
		}
	}

	/**
	 * @protected
	 * @param {VdsEnterFullscreenRequestEvent} event
	 * @returns {Promise<void>}
	 */
	async handleEnterFullscreenRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaContainer)) {
			await this.mediaContainer.requestFullscreen();
		} else if (!isNil(this.mediaProvider)) {
			await this.mediaProvider.requestFullscreen();
		}
	}

	/**
	 * @protected
	 * @param {VdsExitFullscreenRequestEvent} event
	 * @returns {Promise<void>}
	 */
	async handleExitFullscreenRequest(event) {
		this.mediaRequestEventGateway(event);
		if (!isNil(this.mediaContainer)) {
			await this.mediaContainer.exitFullscreen();
		} else if (!isNil(this.mediaProvider)) {
			await this.mediaProvider.exitFullscreen();
		}
	}
}
