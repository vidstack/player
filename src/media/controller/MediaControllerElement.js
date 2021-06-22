import { html } from 'lit';

import { provideContextRecord } from '../../shared/context/index.js';
import { VdsElement } from '../../shared/elements/index.js';
import {
	bindEventListeners,
	DisposalBin,
	listen,
	redispatchNativeEvent
} from '../../shared/events/index.js';
import { storybookAction } from '../../shared/storybook/index.js';
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
	VdsSeekingRequestEvent,
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

	disconnectedCallback() {
		super.disconnectedCallback();
		this.destroyMediaProviderBridge();
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
	 * The current media container that belongs to this controller. Defaults to `undefined` if
	 * there is none.
	 *
	 * @type {MediaContainerElement | undefined}
	 */
	mediaContainer;

	/**
	 * @protected
	 * @param {VdsMediaContainerConnectEvent} event
	 * @returns {void}
	 */
	handleMediaContainerConnect(event) {
		const { container, onDisconnect } = event.detail;
		this.mediaContainer = container;
		onDisconnect(() => {
			this.mediaContainer = undefined;
		});
	}

	// -------------------------------------------------------------------------------------------
	// Media Provider
	// -------------------------------------------------------------------------------------------

	/**
	 * The current media provider that belongs to this controller. Defaults to `undefined` if there
	 * is none.
	 *
	 * @type {MediaProviderElement | undefined}
	 */
	mediaProvider;

	/**
	 * @protected
	 * @param {VdsMediaProviderConnectEvent} event
	 * @returns {void}
	 */
	handleMediaProviderConnect(event) {
		const { provider, onDisconnect } = event.detail;
		this.mediaProvider = provider;
		this.buildMediaProviderBridge();
		/**
		 * Using type `any` to bypass readonly `context`. We are injecting our context object into the
		 * `MediaProviderElement` so it can be managed by it.
		 */
		/** @type {any} */ (provider).context = this.context;
		onDisconnect(() => {
			this.destroyMediaProviderBridge();
			/**
			 * Using type `any` to bypass readonly `context`. Detach the media context.
			 */
			/** @type {any} */ (provider).context = createMediaContextRecord();
			this.mediaProvider = undefined;
		});
	}

	/**
	 * @protected
	 * @readonly
	 */
	mediaProviderBridgeDisposal = new DisposalBin();

	/**
	 * Bridges attributes, events and operations across the media controller to the connected
	 * media provider.
	 *
	 * @protected
	 * @returns {void}
	 */
	buildMediaProviderBridge() {
		if (isNil(this.mediaProvider)) return;
		this.proxyOperationsToMediaProvider();
		this.forwardMediaProviderAttributesAndEvents();
	}

	/**
	 * Proxies unknown operations to the connected media provider (if it exists).
	 *
	 * @protected
	 * @returns {void}
	 */
	proxyOperationsToMediaProvider() {
		if (isNil(this.mediaProvider)) return;

		const provider = this.mediaProvider;
		const shouldProxyOperation = (prop) => !(prop in this) && prop in provider;

		const proto = Object.getPrototypeOf(this);
		const newProto = Object.create(proto);

		Object.setPrototypeOf(
			this,
			new Proxy(newProto, {
				get(target, prop) {
					if (shouldProxyOperation(prop)) {
						return provider[prop];
					}

					return target[prop];
				},
				set(target, prop, value) {
					if (shouldProxyOperation(prop)) {
						provider[prop] = value;
					}

					target[prop] = value;
					return true;
				}
			})
		);

		this.mediaProviderBridgeDisposal.add(() => {
			Object.setPrototypeOf(this, proto);
		});
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	forwardMediaProviderAttributesAndEvents() {
		if (isNil(this.mediaProvider)) return;

		const provider = this.mediaProvider;

		/** @type {Set<string>} */
		const attributes = new Set();
		/** @type {Set<string>} */
		const eventTypes = new Set();

		let ctor = provider.constructor;

		// Walk proto chain and collect attributes + events.
		while (ctor) {
			const props = /** @type {any} */ (ctor).properties ?? {};
			Object.keys(props)
				.map((prop) => props[prop].attribute ?? prop.toLowerCase())
				.forEach((attr) => {
					attributes.add(attr);
				});

			const events = /** @type {any} */ (ctor).events ?? [];
			events.forEach((eventType) => {
				eventTypes.add(eventType);
			});

			ctor = Object.getPrototypeOf(ctor);
		}

		// Observe attributes and forward changes to provider.
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes') {
					const attrName = /** @type {string} **/ (mutation.attributeName);
					const attrValue = /** @type {string} */ (this.getAttribute(attrName));
					provider.setAttribute(attrName, attrValue);
				}
			}
		});

		observer.observe(this, { attributeFilter: Array.from(attributes) });
		this.mediaProviderBridgeDisposal.add(() => observer.disconnect());

		// Listen to dispatched events on provider and forward them.
		Array.from(eventTypes)
			.map((eventType) =>
				listen(provider, eventType, (e) => {
					redispatchNativeEvent(this, e);
				})
			)
			.forEach((dispose) => this.mediaProviderBridgeDisposal.add(dispose));
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	destroyMediaProviderBridge() {
		this.mediaProviderBridgeDisposal.empty();
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

/**
 * @readonly
 * @type {import('./types').MediaControllerElementStorybookArgTypes}
 */
export const VDS_MEDIA_CONTROLLER_ELEMENT_STORYBOOK_ARG_TYPES = {
	onVdsEnterFullscreenRequest: storybookAction(
		VdsEnterFullscreenRequestEvent.TYPE
	),
	onVdsExitFullscreenRequest: storybookAction(
		VdsExitFullscreenRequestEvent.TYPE
	),
	onVdsMuteRequest: storybookAction(VdsMuteRequestEvent.TYPE),
	onVdsPauseRequest: storybookAction(VdsPauseRequestEvent.TYPE),
	onVdsPlayRequest: storybookAction(VdsPlayRequestEvent.TYPE),
	onVdsSeekingRequest: storybookAction(VdsSeekingRequestEvent.TYPE),
	onVdsSeekRequest: storybookAction(VdsSeekRequestEvent.TYPE),
	onVdsUnmuteRequest: storybookAction(VdsUnmuteRequestEvent.TYPE),
	onVdsVolumeChangeRequest: storybookAction(VdsVolumeChangeRequestEvent.TYPE)
};
