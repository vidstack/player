// ** Dependencies **
import '../slider/define.js';

import clsx from 'clsx';
import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import {
	mediaContext,
	MediaRemoteControl,
	VdsPauseRequestEvent,
	VdsPlayRequestEvent,
	VdsSeekingRequestEvent,
	VdsSeekRequestEvent
} from '../../../media/index.js';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VdsElement, WithFocus } from '../../../shared/elements/index.js';
import {
	storybookAction,
	StorybookControlType
} from '../../../shared/storybook/index.js';
import { getSlottedChildren, raf } from '../../../utils/dom.js';
import { formatSpokenTime } from '../../../utils/time.js';
import { throttle } from '../../../utils/timing.js';
import { isNil, isUndefined } from '../../../utils/unit.js';
import {
	SliderElement,
	VDS_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
	VdsSliderDragEndEvent,
	VdsSliderDragStartEvent,
	VdsSliderValueChangeEvent
} from '../slider/index.js';
import { scrubberContext } from './context.js';
import { scrubberElementStyles } from './css.js';
import {
	VdsScrubberPreviewHideEvent,
	VdsScrubberPreviewShowEvent,
	VdsScrubberPreviewTimeUpdateEvent
} from './events.js';

export const VDS_SCRUBBER_ELEMENT_TAG_NAME = 'vds-scrubber';

/** @typedef {import('./types').Scrubber} Scrubber */

/**
 * A control that displays the progression of playback and the amount seekable on a slider. This
 * control can be used to update the current playback time by interacting with the slider.
 *
 * ## Previews / Storyboards
 *
 * You can pass in a preview to be shown while the user is interacting (hover/drag) with the
 * scrubber by passing an element into the `preview` slot, such as `<div slot="preview"></div>`.
 *
 * **You need to do the following on your root preview element:**
 *
 * - Expect that your root preview element will be positioned absolutely.
 * - Set the `bottom` CSS property on it to adjust it to the desired position above the slider.
 * - Create CSS styles for when it has a hidden attribute (`.preview[hidden] {}`).
 *
 * **The Scrubber will automatically do the following to the root preview element passed in:**
 *
 * - Set a `hidden` attribute when it should be hidden (it's left to you to hide it with CSS).
 * - Set a safe `z-index` value so the preview is above all other components and is visible.
 * - Update the `translateX()` CSS property to position the preview accordingly.
 *
 * ### How do I get the current preview time?
 *
 * You can either listen to `vds-scrubber-preview-time-update` event on this component, or you can
 * use the `scrubberPreviewContext`.
 *
 * For styling you have access to the `--vds-scrubber-preview-time` CSS property which contains
 * the current time in seconds the user is previewing.
 *
 * @implements {Scrubber}
 *
 * @tagname vds-scrubber
 *
 * @slot Used to pass content into the root.
 * @slot progress - Used to pass content into the progress element (`<div>`).
 * @slot preview - Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
 *
 * @csspart root - The component's root element (`<div>`).
 *
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`.
 *
 * @csspart progress - The progress element (`<div>`).
 *
 * @csspart preview-track - The part of the slider track that displays
 * @csspart preview-track-hidden - Targets the `preview-track` part when it's hidden.
 *
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
 *
 * @cssprop --vds-scrubber-current-time - Current time of playback.
 * @cssprop --vds-scrubber-seekable - The amount of media that is seekable.
 * @cssprop --vds-scrubber-duration - The length of media playback.
 *
 * @cssprop --vds-scrubber-progress-bg - The background color of the amount that is seekable.
 * @cssprop --vds-scrubber-progress-height - The height of the progress bar (defaults to `--vds-slider-track-height`).
 *
 * @cssprop --vds-scrubber-preview-time - The current time in seconds that is being previewed (hover/drag).
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-preview-track-bg - The background color of the preview track.
 *
 * @example
 * ```html
 * <vds-scrubber
 *  slider-label="Time scrubber"
 *  progress-label="Amount seekable"
 * >
 *  <!-- `hidden` attribute will automatically be applied/removed -->
 *  <div class="preview" slot="preview" hidden>Preview</div>
 * </vds-scrubber
 * ```
 *
 * @example
 * ```css
 * vds-scrubber {
 *   --vds-scrubber-progress-bg: pink;
 * }
 *
 * .preview {
 *   position: absolute;
 *   left: 0;
 *   bottom: 12px;
 *   opacity: 1;
 *   transition: opacity 0.3s ease-in;
 * }
 *
 * .preview[hidden] {
 *   opacity: 0;
 * }
 * ```
 */
export class ScrubberElement extends WithFocus(VdsElement) {
	/** @type {import('lit').CSSResultGroup} */
	static get styles() {
		return [scrubberElementStyles];
	}

	/** @type {string[]} */
	static get parts() {
		const sliderExportParts = SliderElement.parts.map(
			(part) => `slider-${part}`
		);
		return ['root', 'slider', 'progress', ...sliderExportParts];
	}

	/** @type {string[]} */
	static get events() {
		return [
			VdsScrubberPreviewHideEvent.TYPE,
			VdsScrubberPreviewShowEvent.TYPE,
			VdsScrubberPreviewTimeUpdateEvent.TYPE
		];
	}

	constructor() {
		super();

		// Properties
		/** @type {boolean} */
		this.disabled = false;
		/** @type {boolean} */
		this.hidden = false;
		/** @type {boolean} */
		this.noPreviewClamp = false;
		/** @type {boolean} */
		this.noPreviewTrack = false;
		/** @type {'horizontal' | 'vertical'} */
		this.orientation = 'horizontal';
		/** @type {boolean} */
		this.pauseWhileDragging = false;
		/** @type {number} */
		this.previewTimeThrottle = 30;
		/** @type {string} */
		this.progressLabel = 'Amount seekable';
		/** @type {string} */
		this.progressText = '{currentTime} out of {duration}';
		/** @type {string} */
		this.sliderLabel = 'Time scrubber';
		/** @type {number} */
		this.step = 5;
		/** @type {number} */
		this.stepMultiplier = 2;
		/** @type {number} */
		this.throttle = 0;
		/** @type {number} */
		this.userSeekingThrottle = 150;

		// State
		/** @protected @type {number} */
		this.currentTime = 0;
		/** @protected @type {boolean} */
		this.isPointerInsideScrubber = false;
		/** @protected @type {boolean} */
		this.isDraggingThumb = false;

		// Context Consumers
		/** @protected @readonly @type {number} */
		this.mediaCurrentTime = mediaContext.currentTime.initialValue;
		/** @protected @readonly @type {number} */
		this.mediaDuration = 0;
		/** @protected @readonly @type {boolean} */
		this.mediaPaused = mediaContext.paused.initialValue;
		/** @protected @readonly @type {boolean} */
		this.mediaSeeking = mediaContext.seeking.initialValue;
		/** @protected @readonly @type {number} */
		this.mediaSeekableAmount = mediaContext.seekableAmount.initialValue;

		// Context Providers
		/** @protected @type {boolean} */
		this.isPreviewShowing = false;
		/** @protected @type {number} */
		this.previewTime = 0;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			// Properties
			disabled: { type: Boolean, reflect: true },
			hidden: { type: Boolean, reflect: true },
			noPreviewClamp: { type: Boolean, attribute: 'no-preview-clamp' },
			noPreviewTrack: { type: Boolean, attribute: 'no-preview-track' },
			orientation: {},
			pauseWhileDragging: { type: Boolean, attribute: 'pause-while-dragging' },
			previewTimeThrottle: { type: Number, attribute: 'preview-time-throttle' },
			progressLabel: { attribute: 'progress-label' },
			progressText: { attribute: 'progress-text' },
			slider: { type: Number },
			sliderLabel: { attribute: 'slider-label' },
			stepMultiplier: { type: Number, attribute: 'step-ratio' },
			throttle: { type: Number },
			userSeekingThrottle: { type: Number, attribute: 'user-seeking-throttle' },
			// State
			isPointerInsideScrubber: { state: true },
			isDraggingThumb: { state: true },
			previewTime: { state: true },
			currentTime: { state: true }
		};
	}

	/** @type {import('../../../shared/context').ContextProviderDeclarations} */
	static get contextProviders() {
		return {
			isPreviewShowing: scrubberContext.preview.showing,
			previewTime: scrubberContext.preview.time
		};
	}

	/** @type {import('../../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			mediaCurrentTime: mediaContext.currentTime,
			mediaDuration: {
				context: mediaContext.duration,
				transform: (d) => (d >= 0 ? d : 0)
			},
			mediaPaused: mediaContext.paused,
			mediaSeeking: mediaContext.seeking,
			mediaSeekableAmount: mediaContext.seekableAmount
		};
	}

	// -------------------------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------------------------

	connectedCallback() {
		super.connectedCallback();
		this.initThrottles();
	}

	/** @param {import('lit').PropertyValues} changedProperties */
	update(changedProperties) {
		if (
			changedProperties.has('mediaCurrentTime') &&
			!changedProperties.has('isDraggingThumb') &&
			!this.isDraggingThumb
		) {
			this.currentTime = this.mediaCurrentTime;
		}

		if (
			changedProperties.has('previewTimeThrottle') ||
			changedProperties.has('userSeekingThrottle')
		) {
			this.initThrottles();
		}

		if (changedProperties.has('disabled') && this.disabled) {
			this.isPointerInsideScrubber = false;
			this.isDraggingThumb = false;
			this.hidePreview();
		}

		super.update(changedProperties);
	}

	disconnectedCallback() {
		this.destroyThrottles();
		super.disconnectedCallback();
	}

	// -------------------------------------------------------------------------------------------
	// Media Request Events
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 */
	remoteControl = new MediaRemoteControl(this);

	/**
	 * @protected
	 * @param {number} time
	 * @param {Event} event
	 * @returns {void}
	 */
	dispatchUserSeekingEvent(time, event) {
		if (!this.isInteractive) return;
		this.remoteControl.seeking(time, event);
	}

	/**
	 * @protected
	 * @param {number} time
	 * @param {Event} event
	 * @returns {Promise<void>}
	 */
	async dispatchUserSeeked(time, event) {
		// Prevent slider value (time) jumping while `isDragging` is being updated to `false`.
		await this.updateComplete;
		this.currentTime = time;
		this.remoteControl.seek(time, event);
	}

	// -------------------------------------------------------------------------------------------
	// Render (Root)
	// -------------------------------------------------------------------------------------------

	render() {
		return this.renderScrubber();
	}

	// -------------------------------------------------------------------------------------------
	// Scrubber
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

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderScrubber() {
		return html`
			<div
				id="root"
				part=${this.getScrubberPartAttr()}
				style=${styleMap(this.getScrubberStyleMap())}
				@pointerenter=${this.handleScrubberPointerEnter}
				@pointerleave=${this.handleScrubberPointerLeave}
				@pointermove=${this.handleScrubberPointerMove}
				?hidden=${this.hidden}
				${ref(this.rootRef)}
			>
				${this.renderSlider()}${this.renderDefaultSlot()}${this.renderPreviewSlot()}
			</div>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getScrubberPartAttr() {
		return 'root';
	}

	/**
	 * @protected
	 * @returns {import('lit/directives/style-map').StyleInfo}
	 */
	getScrubberStyleMap() {
		return {
			'--vds-scrubber-current-time': String(this.mediaCurrentTime),
			'--vds-scrubber-seekable': String(this.mediaSeekableAmount),
			'--vds-scrubber-duration': String(this.mediaDuration),
			'--vds-scrubber-preview-time': String(this.previewTime)
		};
	}

	/**
	 * @protected
	 * @param {PointerEvent} event
	 * @returns {Promise<void>}
	 */
	async handleScrubberPointerEnter(event) {
		if (this.disabled) return;
		this.isPointerInsideScrubber = true;
		this.showPreview(event);
	}

	/**
	 * @protected
	 * @param {PointerEvent} event
	 * @returns {Promise<void>}
	 */
	async handleScrubberPointerLeave(event) {
		this.isPointerInsideScrubber = false;
		this.hidePreview(event);
	}

	/**
	 * @protected
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	handleScrubberPointerMove(event) {
		if (this.disabled) return;
		this.updatePreviewPosition(event);
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderDefaultSlot() {
		return html`<slot></slot>`;
	}

	// -------------------------------------------------------------------------------------------
	// Progress
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<HTMLProgressElement>}
	 */
	progressRef = createRef();

	get progressElement() {
		return /** @type {HTMLProgressElement} */ (this.progressRef.value);
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderProgress() {
		const valueText = `${(this.mediaDuration > 0
			? (this.mediaSeekableAmount / this.mediaDuration) * 100
			: 0
		).toFixed(0)}%`;

		return html`
			<div
				id="progress"
				role="progressbar"
				part=${this.getProgressPartAttr()}
				?hidden=${this.hidden}
				aria-label=${this.progressLabel}
				aria-valuemin="0"
				aria-valuemax=${this.mediaDuration}
				aria-valuenow=${this.mediaSeekableAmount}
				aria-valuetext=${valueText}
				${ref(this.progressRef)}
			>
				${this.renderProgressSlot()}
			</div>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getProgressPartAttr() {
		return 'progress';
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderProgressSlot() {
		return html`<slot name="progress"></slot>`;
	}

	// -------------------------------------------------------------------------------------------
	// Slider
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<SliderElement>}
	 */
	sliderRef = createRef();

	get sliderElement() {
		return /** @type {SliderElement} */ (this.sliderRef.value);
	}

	get isInteractive() {
		return this.isPointerInsideScrubber || this.isDraggingThumb;
	}

	get shouldDisplayPreviewTime() {
		return this.isDraggingThumb;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderSlider() {
		return html`
			<vds-slider
				id="slider"
				label=${ifNonEmpty(this.sliderLabel)}
				min="0"
				max=${this.mediaDuration}
				value=${this.shouldDisplayPreviewTime
					? this.previewTime
					: this.currentTime}
				step=${this.step}
				step-multiplier=${this.stepMultiplier}
				part=${this.getSliderPartAttr()}
				orientation=${this.orientation}
				throttle=${this.throttle}
				value-text=${this.getSliderProgressText()}
				@vds-slider-value-change=${this.handleSliderValueChange}
				@vds-slider-drag-start=${this.handleSliderDragStart}
				@vds-slider-drag-end=${this.handleSliderDragEnd}
				exportparts=${this.getSliderExportPartsAttr()}
				?hidden=${this.hidden}
				?disabled=${this.disabled}
				${ref(this.sliderRef)}
			>
				${this.renderSliderChildren()}
			</vds-slider>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getSliderPartAttr() {
		return 'slider';
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getSliderExportPartsAttr() {
		// Take all slider parts and re-export with `slider` prefix (eg: `root` => `slider-root`).
		return SliderElement.parts
			.map((part) => `${part}: slider-${part}`)
			.join(', ');
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getSliderProgressText() {
		return this.progressText
			.replace('{currentTime}', formatSpokenTime(this.mediaCurrentTime))
			.replace('{duration}', formatSpokenTime(this.mediaDuration));
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderSliderChildren() {
		return html`
			<slot name="slider"></slot>
			${this.renderProgress()} ${this.renderPreviewTrack()}
		`;
	}

	/**
	 * @protected
	 * @param {VdsSliderValueChangeEvent} event
	 * @returns {Promise<void>}
	 */
	async handleSliderValueChange(event) {
		const originalEvent = /** @type {Event} */ (event.originalEvent);

		if (!originalEvent.type.includes('pointer')) {
			this.updatePreviewTime(event.detail, event);
		} else {
			await this.updatePreviewPosition(
				/** @type {PointerEvent} */ (originalEvent)
			);
		}

		if (!this.isDraggingThumb) this.dispatchUserSeeked(this.previewTime, event);
	}

	/**
	 * @protected
	 * @param {VdsSliderDragStartEvent} event
	 * @returns {Promise<void>}
	 */
	async handleSliderDragStart(event) {
		const pointerEvent = /** @type {PointerEvent} */ (event.originalEvent);
		this.isDraggingThumb = true;
		this.showPreview(pointerEvent);
		this.togglePlaybackWhileDragging(event);
	}

	/**
	 * @protected
	 * @param {VdsSliderDragEndEvent} event
	 * @returns {Promise<void>}
	 */
	async handleSliderDragEnd(event) {
		const pointerEvent = /** @type {PointerEvent} */ (event.originalEvent);
		this.isDraggingThumb = false;
		this.hidePreview(pointerEvent);
		this.dispatchUserSeeked(this.previewTime, event);
		this.togglePlaybackWhileDragging(event);
	}

	/**
	 * @protected
	 * @type {boolean}
	 */
	wasPlayingBeforeDragStart = false;

	/**
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	togglePlaybackWhileDragging(event) {
		if (!this.pauseWhileDragging) return;

		if (this.isDraggingThumb && !this.mediaPaused) {
			this.wasPlayingBeforeDragStart = true;
			this.remoteControl.pause(event);
		} else if (
			this.wasPlayingBeforeDragStart &&
			!this.isDraggingThumb &&
			this.mediaPaused
		) {
			this.wasPlayingBeforeDragStart = false;
			this.remoteControl.play(event);
		}
	}

	// -------------------------------------------------------------------------------------------
	// Preview Track Fill
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
	 */
	previewTrackRef = createRef();

	get previewTrackElement() {
		return this.previewTrackRef.value;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderPreviewTrack() {
		if (this.noPreviewTrack) return html``;

		return html`
			<div
				id="preview-track"
				part=${this.getPreviewTrackPartAttr()}
				?hidden=${!this.isInteractive}
				?disabled=${this.disabled}
			></div>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getPreviewTrackPartAttr() {
		return clsx('preview-track', 'preview-track-hidden' && !this.isInteractive);
	}

	// -------------------------------------------------------------------------------------------
	// Preview
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @type {HTMLElement | undefined}
	 */
	currentPreviewSlotElement;

	get previewSlotElement() {
		return this.currentPreviewSlotElement;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderPreviewSlot() {
		return html`
			<slot
				name="${this.getPreviewSlotName()}"
				@slotchange="${this.handlePreviewSlotChange}"
			></slot>
		`;
	}

	/**
	 * @protected
	 * @returns {string}
	 */
	getPreviewSlotName() {
		return 'preview';
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	handlePreviewSlotChange() {
		this.currentPreviewSlotElement = /** @type {HTMLElement} */ (
			getSlottedChildren(this, this.getPreviewSlotName())[0]
		);

		if (!isNil(this.currentPreviewSlotElement)) {
			this.currentPreviewSlotElement.style.position = 'absolute';
			this.currentPreviewSlotElement.style.left = '0';
			this.currentPreviewSlotElement.style.zIndex = '90';
			this.currentPreviewSlotElement.style.willChange = 'transform';
			this.hidePreview();
		}
	}

	/**
	 * @protected
	 * @returns {boolean}
	 */
	isCurrentPreviewHidden() {
		return this.currentPreviewSlotElement?.hasAttribute('hidden') ?? true;
	}

	/**
	 * @protected
	 * @type {number | undefined}
	 */
	showPreviewTimeout;

	/**
	 * @protected
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	showPreview(event) {
		window.clearTimeout(this.showPreviewTimeout);

		if (
			this.disabled ||
			isNil(this.currentPreviewSlotElement) ||
			!this.isInteractive ||
			(this.isInteractive && !this.isCurrentPreviewHidden())
		) {
			return;
		}

		this.showPreviewTimeout = window.setTimeout(
			async () => {
				this.isPreviewShowing = true;
				this.currentPreviewSlotElement?.removeAttribute('hidden');
				await raf();
				await this.updatePreviewPosition(event);
				await this.updateComplete;
				this.dispatchEvent(
					new VdsScrubberPreviewShowEvent({ originalEvent: event })
				);
			},
			this.isDraggingThumb ? 150 : 0
		);

		this.requestUpdate();
	}

	/**
	 * @protected
	 * @param {PointerEvent | undefined} [event]
	 * @returns {Promise<void>}
	 */
	async hidePreview(event) {
		window.clearTimeout(this.showPreviewTimeout);

		if (
			this.isInteractive ||
			(!this.isInteractive && this.isCurrentPreviewHidden())
		) {
			return;
		}

		if (!isUndefined(event)) {
			this.updatePreviewPosition(event);
			await this.updateComplete;
		}

		this.isPreviewShowing = false;
		this.currentPreviewSlotElement?.setAttribute('hidden', '');
		this.dispatchEvent(
			new VdsScrubberPreviewHideEvent({ originalEvent: event })
		);
		this.requestUpdate();
	}

	/**
	 * @protected
	 * @param {number} time
	 * @param {Event} event
	 * @returns {void}
	 */
	dispatchPreviewTimeChangeEvent(time, event) {
		if (!this.isInteractive) return;
		this.mediaSeekingRequestThrottle?.(time, event);
		this.dispatchEvent(
			new VdsScrubberPreviewTimeUpdateEvent({
				detail: time,
				originalEvent: event
			})
		);
	}

	/**
	 * @protected
	 * @param {number} thumbPosition
	 * @returns {number}
	 */
	calcPercentageOfMediaDurationOnThumb(thumbPosition) {
		const trackRect = this.sliderElement.trackElement.getBoundingClientRect();
		return Math.max(
			0,
			Math.min(100, (100 / trackRect.width) * (thumbPosition - trackRect.left))
		);
	}

	/**
	 * @protected
	 * @param {number} durationPercentage
	 * @returns {number}
	 */
	calcPreviewXPosition(durationPercentage) {
		const rootRect = this.rootElement.getBoundingClientRect();

		const previewRectWidth =
			this.currentPreviewSlotElement?.getBoundingClientRect().width ?? 0;

		// Margin on slider usually represents (thumb width / 2) so thumb is contained when on edge.
		const sliderXMargin = parseFloat(
			window.getComputedStyle(this.sliderElement.rootElement).marginLeft
		);

		const left =
			(durationPercentage / 100) * rootRect.width - previewRectWidth / 2;

		const rightLimit = rootRect.width - previewRectWidth - sliderXMargin;

		return this.noPreviewClamp
			? left
			: Math.max(sliderXMargin, Math.min(left, rightLimit));
	}

	/**
	 * @protected
	 * @param {number} time
	 * @param {Event} event
	 * @returns {void}
	 */
	updatePreviewTime(time, event) {
		this.previewTime = time;
		this.previewTimeChangeThrottle?.(this.previewTime, event);
	}

	/**
	 * @protected
	 * @type {number}
	 */
	previewPositionRafId = 0;

	/**
	 * @protected
	 * @param {PointerEvent} event
	 * @returns {Promise<void>}
	 */
	async updatePreviewPosition(event) {
		window.cancelAnimationFrame(this.previewPositionRafId);
		this.previewPositionRafId = await raf(async () => {
			const percent = this.calcPercentageOfMediaDurationOnThumb(event.clientX);
			this.updatePreviewTime((percent / 100) * this.mediaDuration, event);
			if (!isNil(this.currentPreviewSlotElement)) {
				const xPos = this.calcPreviewXPosition(percent);
				this.currentPreviewSlotElement.style.transform = `translateX(${xPos}px)`;
			}
		});
	}

	// -------------------------------------------------------------------------------------------
	// Preview Throttles
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @type {import('./types').PreviewTimeChangeThrottle}
	 */
	previewTimeChangeThrottle;

	/**
	 * @protected
	 * @type {import('./types').MediaSeekingRequestThrottle}
	 */
	mediaSeekingRequestThrottle;

	/**
	 * @protected
	 * @returns {void}
	 */
	initThrottles() {
		this.destroyThrottles();

		this.previewTimeChangeThrottle = throttle(
			this.dispatchPreviewTimeChangeEvent.bind(this),
			this.previewTimeThrottle
		);

		this.mediaSeekingRequestThrottle = throttle(
			this.dispatchUserSeekingEvent.bind(this),
			this.userSeekingThrottle
		);
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	destroyThrottles() {
		this.previewTimeChangeThrottle?.cancel();
		this.previewTimeChangeThrottle = undefined;
		this.mediaSeekingRequestThrottle?.cancel();
		this.mediaSeekingRequestThrottle = undefined;
	}
}

/**
 * @readonly
 * @type {import('./types').ScrubberElementStorybookArgTypes}
 */
export const VDS_SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES = {
	// Properties
	disabled: VDS_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.disabled,
	hidden: VDS_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.hidden,
	noPreviewClamp: {
		control: StorybookControlType.Boolean,
		defaultValue: false
	},
	noPreviewTrack: {
		control: StorybookControlType.Boolean,
		defaultValue: false
	},
	orientation: VDS_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.orientation,
	pauseWhileDragging: {
		control: StorybookControlType.Boolean,
		defaultValue: false
	},
	previewTimeThrottle: {
		control: StorybookControlType.Number,
		defaultValue: 30
	},
	progressLabel: {
		control: StorybookControlType.Text,
		defaultValue: 'Amount seekable'
	},
	progressText: {
		control: StorybookControlType.Text,
		defaultValue: '{currentTime} out of {duration}'
	},
	sliderLabel: {
		control: StorybookControlType.Text,
		defaultValue: 'Time scrubber'
	},
	step: { control: StorybookControlType.Number, defaultValue: 5 },
	stepMultiplier: { control: StorybookControlType.Number, defaultValue: 2 },
	throttle: { control: StorybookControlType.Number, defaultValue: 0 },
	userSeekingThrottle: {
		control: StorybookControlType.Number,
		defaultValue: 150
	},
	// Scrubber Actions
	onVdsScrubberPreviewShow: storybookAction(VdsScrubberPreviewShowEvent.TYPE),
	onVdsScrubberPreviewHide: storybookAction(VdsScrubberPreviewHideEvent.TYPE),
	onVdsScrubberPreviewTimeUpdate: storybookAction(
		VdsScrubberPreviewTimeUpdateEvent.TYPE
	),
	// Media Request Actions
	onVdsPlayRequest: storybookAction(VdsPlayRequestEvent.TYPE),
	onVdsPauseRequest: storybookAction(VdsPauseRequestEvent.TYPE),
	onVdsSeekRequest: storybookAction(VdsSeekRequestEvent.TYPE),
	onVdsSeekingRequest: storybookAction(VdsSeekingRequestEvent.TYPE),
	// Media Properties
	mediaCurrentTime: {
		control: StorybookControlType.Number,
		defaultValue: 1000
	},
	mediaDuration: { control: StorybookControlType.Number, defaultValue: 3600 },
	mediaPaused: { control: StorybookControlType.Boolean, defaultValue: true },
	mediaSeekableAmount: {
		control: StorybookControlType.Number,
		defaultValue: 1800
	}
};
