import clsx from 'clsx';
import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { VdsElement } from '../../shared/elements/index.js';
import { FullscreenController } from '../../shared/fullscreen/index.js';
import { ScreenOrientationController } from '../../shared/screen-orientation/index.js';
import { storybookAction } from '../../shared/storybook/helpers.js';
import { StorybookControlType } from '../../shared/storybook/index.js';
import { getSlottedChildren } from '../../utils/dom.js';
import { isNil, isString, isUndefined } from '../../utils/unit.js';
import { mediaContext } from '../media.context.js';
import { MediaProviderElement } from '../provider/index.js';
import { mediaContainerElementStyles } from './css.js';
import { VdsMediaContainerConnectEvent } from './events.js';

export const VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME = `vds-media-container`;

/** @typedef {import('./types').MediaContainer} IMediaContainer */

/**
 * Simple container for a media provider and the media user interface (UI).
 *
 * @implements {IMediaContainer}
 *
 * @tagname vds-media-container
 *
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart media - The media container element (`<div>`).
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
 *     <vds-media-ui>
 *       <!-- UI components here. -->
 *     </vds-media-ui>
 *   </vds-media-container>
 * </vds-media-controller>
 * ```
 */
export class MediaContainerElement extends VdsElement {
	/** @type {import('lit').CSSResultGroup} */
	static get styles() {
		return [mediaContainerElementStyles];
	}

	/** @type {string[]} */
	static get parts() {
		return ['root', 'media'];
	}

	constructor() {
		super();

		// Properties
		/**
		 * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
		 * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
		 *
		 * @type {string | undefined}
		 */
		this.aspectRatio = undefined;

		// Context
		/** @protected @readonly @type {boolean} */
		this.mediaCanPlay = mediaContext.canPlay.initialValue;
		/** @protected @readonly @type {boolean} */
		this.mediaFullscreen = mediaContext.fullscreen.initialValue;
		/** @protected @readonly @type {boolean} */
		this.mediaIsVideoView = mediaContext.isVideoView.initialValue;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			aspectRatio: { attribute: 'aspect-ratio' }
		};
	}

	/** @type {import('../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			mediaCanPlay: mediaContext.canPlay,
			mediaFullscreen: mediaContext.fullscreen,
			mediaIsVideoView: mediaContext.isVideoView
		};
	}

	// -------------------------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------------------------

	connectedCallback() {
		super.connectedCallback();
		this.dispatchDiscoveryEvent();
	}

	// -------------------------------------------------------------------------------------------
	// Discovery
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @returns {void}
	 */
	dispatchDiscoveryEvent() {
		this.dispatchEvent(
			new VdsMediaContainerConnectEvent({
				detail: {
					container: this,
					onDisconnect: (callback) => {
						this.disconnectDisposal.add(callback);
					}
				}
			})
		);
	}

	// -------------------------------------------------------------------------------------------
	// Render - Root
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
	 */
	rootRef = createRef();

	get rootElement() {
		return /** @type {HTMLDivElement} */ (this.rootRef.value);
	}

	render() {
		return html`
			<div
				id="root"
				aria-busy=${this.getAriaBusy()}
				class=${this.getRootClassAttr()}
				part=${this.getRootPartAttr()}
				style=${styleMap(this.getRootStyleMap())}
				${ref(this.rootRef)}
			>
				${this.renderRootChildren()}
			</div>
		`;
	}

	/**
	 * Override this to modify the content rendered inside the root cotnainer.
	 *
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderRootChildren() {
		return html`${this.renderMedia()}${this.renderDefaultSlot()}`;
	}

	/**
	 * Override this to modify rendering of default slot.
	 *
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderDefaultSlot() {
		return html`<slot></slot>`;
	}

	/**
	 * Override this to modify root container CSS Classes.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootClassAttr() {
		return clsx({
			'with-aspect-ratio': this.shouldApplyAspectRatio()
		});
	}

	/**
	 * Override this to modify root container CSS parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootPartAttr() {
		return 'root';
	}

	/**
	 * Override this to modify root container styles.
	 *
	 * @protected
	 * @returns {import('lit/directives/style-map').StyleInfo}
	 */
	getRootStyleMap() {
		return {
			'padding-bottom': this.getAspectRatioPadding()
		};
	}

	/**
	 * @protected
	 * @returns {'true' | 'false'}
	 */
	getAriaBusy() {
		return this.mediaCanPlay ? 'false' : 'true';
	}

	// -------------------------------------------------------------------------------------------
	// Aspect Ratio
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @returns {boolean}
	 */
	shouldApplyAspectRatio() {
		return (
			this.mediaIsVideoView &&
			!this.mediaFullscreen &&
			isString(this.aspectRatio) &&
			/\d{1,2}:\d{1,2}/.test(this.aspectRatio)
		);
	}

	/**
	 * @protected
	 * @returns {number}
	 */
	calcAspectRatio() {
		if (!this.shouldApplyAspectRatio()) return NaN;
		const [width, height] = (this.aspectRatio ?? '16:9').split(':');
		return (100 / Number(width)) * Number(height);
	}

	/**
	 * @protected
	 * @param {string} maxPadding
	 * @returns {string | undefined}
	 */
	getAspectRatioPadding(maxPadding = '100vh') {
		const ratio = this.calcAspectRatio();
		if (isNaN(ratio)) return undefined;
		return `min(${maxPadding}, ${this.calcAspectRatio()}%)`;
	}

	// -------------------------------------------------------------------------------------------
	// Render - Media
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @type {MediaProviderElement | undefined}
	 */
	_mediaProvider;

	get mediaProvider() {
		return this._mediaProvider;
	}

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
	 */
	mediaContainerRef = createRef();

	get mediaContainerElement() {
		return /** @type {HTMLDivElement} */ (this.mediaContainerRef.value);
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderMedia() {
		return html`
			<div
				id="media-container"
				part="${this.getMediaPartAttr()}"
				${ref(this.mediaContainerRef)}
			>
				${this.renderMediaSlot()}
			</div>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getMediaPartAttr() {
		return 'media';
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderMediaSlot() {
		return html` <slot
			name="${this.getMediaSlotName()}"
			@slotchange="${this.handleMediaSlotChange}"
		></slot>`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getMediaSlotName() {
		return 'media';
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	handleMediaSlotChange() {
		const mediaProvider = /** @type {MediaProviderElement} */ (
			getSlottedChildren(this, this.getMediaSlotName())[0]
		);

		// Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
		// wrong element.
		if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
			throw Error('Invalid media element given to `media` slot.');
		}

		this._mediaProvider = mediaProvider;
		this._mediaProvider?.addFullscreenController(this.fullscreenController);
	}

	// -------------------------------------------------------------------------------------------
	// Fullscreen
	// -------------------------------------------------------------------------------------------

	/**
	 * @readonly
	 */
	fullscreenController = new FullscreenController(
		this,
		new ScreenOrientationController(this)
	);

	/**
	 * @returns {Promise<void>}
	 */
	async requestFullscreen() {
		if (this.shouldFullscreenMediaProvider()) {
			return this.mediaProvider?.requestFullscreen();
		}

		if (this.fullscreenController.isRequestingNativeFullscreen) {
			return super.requestFullscreen();
		}

		return this.fullscreenController.requestFullscreen();
	}

	/**
	 * @returns {Promise<void>}
	 */
	async exitFullscreen() {
		if (this.shouldFullscreenMediaProvider()) {
			return this.mediaProvider?.exitFullscreen();
		}

		return this.fullscreenController.exitFullscreen();
	}

	/**
	 * Whether to fallback to attempting fullscreen directly on the media provider if the native
	 * Fullscreen API is not available. For example, on iOS Safari this will handle managing
	 * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
	 *
	 * @protected
	 * @returns {boolean}
	 */
	shouldFullscreenMediaProvider() {
		return (
			!this.fullscreenController.isSupportedNatively &&
			!isNil(this.mediaProvider)
		);
	}
}

/**
 * @readonly
 * @type {import('./types').MediaContainerElementStorybookArgTypes}
 */
export const VDS_MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES = {
	aspectRatio: { control: StorybookControlType.Text },
	onVdsMediaContainerConnect: storybookAction(
		VdsMediaContainerConnectEvent.TYPE
	)
};
