// ** Dependencies **
import '../ui/define';

import clsx from 'clsx';
import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import { VdsElement } from '../../shared/elements';
import { FullscreenController } from '../../shared/fullscreen';
import { ScreenOrientationController } from '../../shared/screen-orientation';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isString, isUndefined } from '../../utils/unit';
import { mediaContext } from '../media.context';
import { MediaProviderElement } from '../provider';
import { MediaUiElement } from '../ui';
import { mediaContainerElementStyles } from './css';
import { VdsMediaContainerConnectEvent } from './events';

/** @typedef {import('./types').MediaContainerHost} IMediaContainerHost */

/**
 * Simple container for a media provider and the media user interface (UI).
 *
 * @implements {IMediaContainerHost}
 *
 * @tagname vds-media-container
 *
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart media - The media container element (`<div>`).
 * @csspart ui - The media UI component (`<vds-media-ui>`).
 * @csspart ui-* - All media UI components parts re-exported with the `ui` prefix such as `ui-root`.
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
 * </vds-media-controller>
 * ```
 *
 * @example
 * ```css
 * vds-media-container::part(ui-root) {
 *   opacity: 1;
 *   visibility: visible;
 *   transition: opacity 0.3s ease-in;
 * }
 *
 * vds-media-container::part(ui-root-hidden) {
 *   opacity: 0;
 *   visibility: hidden;
 * }
 * ```
 */
export class MediaContainerElement extends VdsElement {
	/** @type {import('lit').CSSResultArray} */
	static get styles() {
		return [mediaContainerElementStyles];
	}

	/** @type {string[]} */
	static get parts() {
		const uiExportParts = MediaUiElement.parts.map((part) => `ui-${part}`);
		return ['root', 'media', 'ui', ...uiExportParts];
	}

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			aspectRatio: { attribute: 'aspect-ratio' }
		};
	}

	/** @type {import('../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			canPlay: mediaContext.canPlay,
			fullscreen: mediaContext.fullscreen,
			isVideoView: mediaContext.isVideoView
		};
	}

	constructor() {
		super();

		// Properties
		this.aspectRatio = undefined;

		// Context
		/** @protected @readonly */
		this.canPlay = mediaContext.canPlay.initialValue;
		/** @protected @readonly */
		this.fullscreen = mediaContext.fullscreen.initialValue;
		/** @protected @readonly */
		this.isVideoView = mediaContext.isVideoView.initialValue;
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
		return this.rootRef.value;
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
		return html`${this.renderMedia()}${this.renderUI()}`;
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
		return this.canPlay ? 'false' : 'true';
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
			this.isVideoView &&
			!this.fullscreen &&
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
		return this.mediaContainerRef.value;
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
		const mediaProvider = /** @type {MediaProviderElement} */ (getSlottedChildren(
			this,
			this.getMediaSlotName()
		)[0]);

		// Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
		// wrong element.
		if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
			throw Error('Invalid media element given to `media` slot.');
		}

		this._mediaProvider = mediaProvider;
		this._mediaProvider?.addFullscreenController(this.fullscreenController);
	}

	// -------------------------------------------------------------------------------------------
	// Render - UI
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<MediaUiElement>}
	 */
	mediaUiRef = createRef();

	get mediaUiElement() {
		return this.mediaUiRef.value;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderUI() {
		return html`
			<vds-media-ui
				id="media-ui"
				part="ui"
				exportparts="${this.getUIExportPartsAttr()}"
				${ref(this.mediaUiRef)}
			>
				${this.renderUIDefaultSlot()}
			</vds-media-ui>
		`;
	}

	/**
	 * Override this to modify UI CSS parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getUIPartAttr() {
		return 'ui';
	}

	/**
	 * Override this to modify UI CSS export parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getUIExportPartsAttr() {
		return MediaUiElement.parts.map((part) => `${part}: ui-${part}`).join(', ');
	}

	/**
	 * Override this to modify rendering of UI default slot.
	 *
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderUIDefaultSlot() {
		return html`<slot></slot>`;
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
	requestFullscreen() {
		if (this.shouldFullscreenMediaProvider()) {
			return this.mediaProvider.requestFullscreen();
		}

		if (this.fullscreenController.isRequestingNativeFullscreen) {
			return super.requestFullscreen();
		}

		return this.fullscreenController.requestFullscreen();
	}

	/**
	 * @returns {Promise<void>}
	 */
	exitFullscreen() {
		if (this.shouldFullscreenMediaProvider()) {
			return this.mediaProvider.exitFullscreen();
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
