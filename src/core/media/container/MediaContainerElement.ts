// ** Dependencies **
import '../ui/vds-media-ui';

import clsx from 'clsx';
import {
	CSSResultArray,
	html,
	internalProperty,
	LitElement,
	property,
	query,
	TemplateResult
} from 'lit-element';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

import { DisposalBin } from '../../../shared/events';
import { getSlottedChildren } from '../../../utils/dom';
import { isNil, isString, isUndefined } from '../../../utils/unit';
import { FullscreenController, FullscreenHost } from '../../fullscreen';
import {
	ScreenOrientationController,
	ScreenOrientationHost
} from '../../screen-orientation';
import { mediaContext } from '../media.context';
import { MediaProviderElement } from '../provider';
import { MediaUiElement } from '../ui';
import { mediaContainerElementStyles } from './media-container.css';
import { VdsMediaContainerConnectEvent } from './media-container.events';
import { MediaContainerElementProps } from './media-container.types';
import { ElementController } from '../../../types/elements';

/**
 * Simple container for a media provider and the media user interface (UI).
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
export class MediaContainerElement
	extends LitElement
	implements MediaContainerElementProps, FullscreenHost, ScreenOrientationHost {
	public addController(controller: ElementController): void {
		throw new Error('Method not implemented.');
	}
	public removeController(controller: ElementController): void {
		throw new Error('Method not implemented.');
	}
	@query('#root') rootEl!: HTMLDivElement;
	@query('#media-ui') mediaUiEl!: MediaUiElement;
	@query('#media-container') mediaContainerEl!: HTMLDivElement;

	static get styles(): CSSResultArray {
		return [mediaContainerElementStyles];
	}

	static get parts(): string[] {
		const uiExportParts = MediaUiElement.parts.map((part) => `ui-${part}`);
		return ['root', 'media', 'ui', ...uiExportParts];
	}

	protected disconnectDisposal = new DisposalBin();

	@internalProperty()
	@mediaContext.canPlay.consume()
	protected canPlay = mediaContext.canPlay.defaultValue;

	@internalProperty()
	@mediaContext.fullscreen.consume()
	protected isFullscreenActive = mediaContext.fullscreen.defaultValue;

	@internalProperty()
	@mediaContext.isVideoView.consume()
	protected isVideoView = mediaContext.isVideoView.defaultValue;

	connectedCallback(): void {
		super.connectedCallback();

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

	disconnectedCallback(): void {
		this.disconnectDisposal.empty();
		super.disconnectedCallback();
	}

	// -------------------------------------------------------------------------------------------
	// Render - Root
	// -------------------------------------------------------------------------------------------

	get rootElement(): HTMLDivElement {
		return this.rootEl;
	}

	render(): TemplateResult {
		return html`
			<div
				id="root"
				aria-busy="${this.getAriaBusy()}"
				class="${this.getRootClassAttr()}"
				part="${this.getRootPartAttr()}"
				style="${styleMap(this.getRootStyleMap())}"
			>
				${this.renderRootContent()}
			</div>
		`;
	}

	/**
	 * Override this to modify the content rendered inside the root cotnainer.
	 */
	protected renderRootContent(): TemplateResult {
		return html`${this.renderMedia()}${this.renderUI()}`;
	}

	/**
	 * Override this to modify root container CSS Classes.
	 */
	protected getRootClassAttr(): string {
		return clsx(this.shouldApplyAspectRatio() && 'with-aspect-ratio');
	}

	/**
	 * Override this to modify root container CSS parts.
	 */
	protected getRootPartAttr(): string {
		return 'root';
	}

	/**
	 * Override this to modify root container styles.
	 */
	protected getRootStyleMap(): StyleInfo {
		return {
			'padding-bottom': this.getAspectRatioPadding()
		};
	}

	protected getAriaBusy(): 'true' | 'false' {
		return this.canPlay ? 'false' : 'true';
	}

	// -------------------------------------------------------------------------------------------
	// Aspect Ratio
	// -------------------------------------------------------------------------------------------

	@property({ attribute: 'aspect-ratio' }) aspectRatio:
		| string
		| undefined = undefined;

	protected shouldApplyAspectRatio(): boolean {
		return (
			this.isVideoView &&
			!this.isFullscreenActive &&
			isString(this.aspectRatio) &&
			/\d{1,2}:\d{1,2}/.test(this.aspectRatio)
		);
	}

	protected calcAspectRatio(): number {
		if (!this.shouldApplyAspectRatio()) return NaN;
		const [width, height] = (this.aspectRatio ?? '16:9').split(':');
		return (100 / Number(width)) * Number(height);
	}

	protected getAspectRatioPadding(maxPadding = '100vh'): string {
		const ratio = this.calcAspectRatio();
		if (isNaN(ratio)) return '';
		return `min(${maxPadding}, ${this.calcAspectRatio()}%)`;
	}

	// -------------------------------------------------------------------------------------------
	// Render - Media
	// -------------------------------------------------------------------------------------------

	protected _mediaProvider?: MediaProviderElement;

	get mediaProvider(): MediaProviderElement | undefined {
		return this._mediaProvider;
	}

	get mediaContainerElement(): HTMLDivElement {
		return this.mediaContainerEl;
	}

	protected renderMedia(): TemplateResult {
		return html`
			<div id="media-container" part="${this.getMediaPartAttr()}">
				${this.renderMediaSlot()}
			</div>
		`;
	}

	protected getMediaPartAttr(): string {
		return 'media';
	}

	protected renderMediaSlot(): TemplateResult {
		return html` <slot
			name="${this.getMediaSlotName()}"
			@slotchange="${this.handleMediaSlotChange}"
		></slot>`;
	}

	protected getMediaSlotName(): string {
		return 'media';
	}

	protected handleMediaSlotChange(): void {
		const mediaProvider = getSlottedChildren(
			this,
			this.getMediaSlotName()
		)[0] as MediaProviderElement;

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

	get mediaUiElement(): MediaUiElement {
		return this.mediaUiEl;
	}

	protected renderUI(): TemplateResult {
		return html`
			<vds-media-ui
				id="media-ui"
				part="ui"
				exportparts="${this.getUIExportPartsAttr()}"
			>
				${this.renderUIDefaultSlot()}
			</vds-media-ui>
		`;
	}

	/**
	 * Override this to modify UI CSS Parts.
	 */
	protected getUIPartAttr(): string {
		return 'ui';
	}

	protected getUIExportPartsAttr(): string {
		return MediaUiElement.parts.map((part) => `${part}: ui-${part}`).join(', ');
	}

	/**
	 * Override this to modify rendering of UI default slot.
	 */
	protected renderUIDefaultSlot(): TemplateResult {
		return html`<slot></slot>`;
	}

	// -------------------------------------------------------------------------------------------
	// Fullscreen
	// -------------------------------------------------------------------------------------------

	fullscreenController = new FullscreenController(
		this,
		new ScreenOrientationController(this)
	);

	requestFullscreen(): Promise<void> {
		if (this.shouldFullscreenMediaProvider()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return this.mediaProvider!.requestFullscreen();
		}

		if (this.fullscreenController.isRequestingNativeFullscreen) {
			return super.requestFullscreen();
		}

		return this.fullscreenController.requestFullscreen();
	}

	exitFullscreen(): Promise<void> {
		if (this.shouldFullscreenMediaProvider()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return this.mediaProvider!.exitFullscreen();
		}

		return this.fullscreenController.exitFullscreen();
	}

	/**
	 * Whether to fallback to attempting fullscreen directly on the media provider if the native
	 * Fullscreen API is not available. For example, on iOS Safari this will handle managing
	 * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
	 */
	protected shouldFullscreenMediaProvider(): boolean {
		return (
			!this.fullscreenController.isSupportedNatively &&
			!isNil(this.mediaProvider)
		);
	}
}
