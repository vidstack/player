export const SCRUBBER_ELEMENT_TAG_NAME: "vds-scrubber";
/**
 * A control that displays the progression of playback and the amount seekable on a slider. This
 * control can be used to update the current playback time by interacting with the slider.
 *
 * ## Previews / Storyboards
 *
 * You can pass in a preview to be shown while the user is interacting (hover/drag) with the
 * scrubber by passing an element into the `preview` slot, such as `<div slot="preview"></div>`.
 *
 * You need to do the following on your root preview element:**
 *
 * - Expect that your root preview element will be positioned absolutely.
 * - Set the `bottom` CSS property on it to adjust it to the desired position above the slider.
 * - Create CSS styles for when it has a hidden attribute (`.preview[hidden] {}`).
 *
 * The Scrubber will automatically do the following to the root preview element passed in:**
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
 * @tagname vds-scrubber
 * @slot Used to pass content into the root.
 * @slot progress - Used to pass content into the progress element (`<div>`).
 * @slot preview - Used to pass in a preview to be shown while the user is interacting (hover/drag) with the scrubber.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
 * @csspart root - The component's root element (`<div>`).
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`.
 * @csspart progress - The progress element (`<div>`).
 * @csspart preview-track - The part of the slider track that displays
 * @csspart preview-track-hidden - Targets the `preview-track` part when it's hidden.
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
 * @cssprop --vds-scrubber-current-time - Current time of playback.
 * @cssprop --vds-scrubber-seekable - The amount of media that is seekable.
 * @cssprop --vds-scrubber-duration - The length of media playback.
 * @cssprop --vds-scrubber-progress-bg - The background color of the amount that is seekable.
 * @cssprop --vds-scrubber-progress-height - The height of the progress bar (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-scrubber-preview-time - The current time in seconds that is being previewed (hover/drag).
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-preview-track-bg - The background color of the preview track.
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
export class ScrubberElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /** @type {import('../../../foundation/context/types').ContextProviderDeclarations} */
    static get contextProviders(): import("../../../foundation/context/types").ContextProviderDeclarations<any>;
    /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * Whether the scubber is disabled.
     *
     * @type {boolean}
     */
    disabled: boolean;
    /**
     * Whether the preview passed in should NOT be clamped to the scrubber edges. In other words,
     * setting this to `true` means the preview element can escape the scrubber bounds.
     *
     * @type {boolean}
     */
    noPreviewClamp: boolean;
    /**
     * Whether to remove the preview track.
     *
     * @type {boolean}
     */
    noPreviewTrack: boolean;
    /** @type {'horizontal' | 'vertical'} */
    orientation: 'horizontal' | 'vertical';
    /**
     * Whether the scrubber should request playback to pause while the user is dragging the
     * thumb. If the media was playing before the dragging starts, the state will be restored by
     * dispatching a user play request once the dragging ends.
     *
     * @type {boolean}
     */
    pauseWhileDragging: boolean;
    /**
     * The amount of milliseconds to throttle preview time updates by.
     *
     * @type {number}
     */
    previewTimeThrottle: number;
    /**
     * ♿ **ARIA:** The `aria-label` for the buffered progress bar.
     *
     * @type {string}
     */
    progressLabel: string;
    /**
     * ♿ **ARIA:** Human-readable text alternative for the current scrubber progress. If you pass
     * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
     * the spoken form such as `20 minutes out of 1 hour, 20 minutes. `
     *
     * @type {string}
     */
    progressText: string;
    /**
     * ♿ **ARIA:** The `aria-label` for the slider.
     *
     * @type {string}
     */
    sliderLabel: string;
    /** @type {number} */
    step: number;
    /** @type {number} */
    stepMultiplier: number;
    /**
     * The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove`
     * events.
     *
     * @type {number}
     */
    throttle: number;
    /**
     * The amount of milliseconds to throttle user seeking events being dispatched.
     *
     * @type {number}
     */
    userSeekingThrottle: number;
    /**
     * @protected
     * @type {number}
     */
    protected currentTime: number;
    /**
     * @protected
     * @type {boolean}
     */
    protected isPointerInsideScrubber: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected isDraggingThumb: boolean;
    /**
     * @protected
     * @type {number}
     */
    protected mediaCurrentTime: number;
    /**
     * @protected
     * @type {number}
     */
    protected mediaDuration: number;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaPaused: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaSeeking: boolean;
    /**
     * @protected
     * @type {number}
     */
    protected mediaSeekableAmount: number;
    /**
     * @protected
     * @type {boolean}
     */
    protected isPreviewShowing: boolean;
    /**
     * @protected
     * @type {number}
     */
    protected previewTime: number;
    /**
     * @protected
     * @readonly
     */
    protected readonly remoteControl: MediaRemoteControl;
    /**
     * @protected
     * @param {number} time
     * @param {Event} event
     */
    protected dispatchUserSeekingEvent(time: number, event: Event): void;
    /**
     * @protected
     * @param {number} time
     * @param {Event} event
     * @returns {Promise<void>}
     */
    protected dispatchUserSeeked(time: number, event: Event): Promise<void>;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly rootRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The component's root element.
     *
     * @type {HTMLDivElement}
     */
    get rootElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderScrubber(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getScrubberPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit/directives/style-map').StyleInfo}
     */
    protected getScrubberStyleMap(): import('lit/directives/style-map').StyleInfo;
    /**
     * @protected
     * @param {PointerEvent} event
     * @returns {Promise<void>}
     */
    protected handleScrubberPointerEnter(event: PointerEvent): Promise<void>;
    /**
     * @protected
     * @param {PointerEvent} event
     * @returns {Promise<void>}
     */
    protected handleScrubberPointerLeave(event: PointerEvent): Promise<void>;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handleScrubberPointerMove(event: PointerEvent): void;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderDefaultSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLProgressElement>}
     */
    protected readonly progressRef: import('lit/directives/ref').Ref<HTMLProgressElement>;
    /**
     * Returns the underlying `<progress>` element.
     *
     * @type {HTMLProgressElement}
     */
    get progressElement(): HTMLProgressElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderProgress(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getProgressPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderProgressSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<SliderElement>}
     */
    protected readonly sliderRef: import('lit/directives/ref').Ref<SliderElement>;
    /**
     * Returns the underlying `vds-slider` component.
     *
     * @type {SliderElement}
     */
    get sliderElement(): SliderElement;
    /**
     * Whether the user is seeking by either hovering over the scrubber or by dragging the thumb.
     *
     * @type {boolean}
     */
    get isInteractive(): boolean;
    /**
     * Whether the slider value should be set to the preview time instead of the current time.
     *
     * @type {boolean}
     */
    get shouldDisplayPreviewTime(): boolean;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderSlider(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getSliderPartAttr(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getSliderExportPartsAttr(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getSliderProgressText(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderSliderChildren(): import('lit').TemplateResult;
    /**
     * @protected
     * @param {SliderValueChangeEvent} event
     * @returns {Promise<void>}
     */
    protected handleSliderValueChange(event: SliderValueChangeEvent): Promise<void>;
    /**
     * @protected
     * @param {SliderDragStartEvent} event
     * @returns {Promise<void>}
     */
    protected handleSliderDragStart(event: SliderDragStartEvent): Promise<void>;
    /**
     * @protected
     * @param {SliderDragEndEvent} event
     * @returns {Promise<void>}
     */
    protected handleSliderDragEnd(event: SliderDragEndEvent): Promise<void>;
    /**
     * @protected
     * @type {boolean}
     */
    protected wasPlayingBeforeDragStart: boolean;
    /**
     * @protected
     * @param {Event} event
     */
    protected togglePlaybackWhileDragging(event: Event): void;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly previewTrackRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * Returns the underlying preview track fill element (`<div>`). This will be `undefined` if
     * you set the `noPreviewTrack` property to true.
     *
     * @type {HTMLDivElement | undefined}
     */
    get previewTrackElement(): HTMLDivElement | undefined;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderPreviewTrack(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getPreviewTrackPartAttr(): string;
    /**
     * @protected
     * @type {HTMLElement | undefined}
     */
    protected currentPreviewSlotElement: HTMLElement | undefined;
    /**
     * The element passed in to the `preview` slot.
     *
     * @type {HTMLElement | undefined}
     */
    get previewSlotElement(): HTMLElement | undefined;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderPreviewSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getPreviewSlotName(): string;
    /**
     * @protected
     */
    protected handlePreviewSlotChange(): void;
    /**
     * @protected
     * @returns {boolean}
     */
    protected isCurrentPreviewHidden(): boolean;
    /**
     * @protected
     * @type {number | undefined}
     */
    protected showPreviewTimeout: number | undefined;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected showPreview(event: PointerEvent): void;
    /**
     * @protected
     * @param {PointerEvent | undefined} [event]
     * @returns {Promise<void>}
     */
    protected hidePreview(event?: PointerEvent | undefined): Promise<void>;
    /**
     * @protected
     * @param {number} time
     * @param {Event} event
     */
    protected dispatchPreviewTimeChangeEvent(time: number, event: Event): void;
    /**
     * @protected
     * @param {number} thumbPosition
     * @returns {number}
     */
    protected calcPercentageOfMediaDurationOnThumb(thumbPosition: number): number;
    /**
     * @protected
     * @param {number} durationPercentage
     * @returns {number}
     */
    protected calcPreviewXPosition(durationPercentage: number): number;
    /**
     * @protected
     * @param {number} time
     * @param {Event} event
     */
    protected updatePreviewTime(time: number, event: Event): void;
    /**
     * @protected
     * @type {number}
     */
    protected previewPositionRafId: number;
    /**
     * @protected
     * @param {PointerEvent} event
     * @returns {Promise<void>}
     */
    protected updatePreviewPosition(event: PointerEvent): Promise<void>;
    /**
     * @protected
     * @type {import('../../../utils/timing').ThrottledFunction<[time: number, event: Event]> | undefined}
     */
    protected previewTimeChangeThrottle: import('../../../utils/timing').ThrottledFunction<[time: number, event: Event]> | undefined;
    /**
     * @protected
     * @type {import('../../../utils/timing').ThrottledFunction<[time: number, event: Event]> | undefined}
     */
    protected mediaSeekingRequestThrottle: import('../../../utils/timing').ThrottledFunction<[time: number, event: Event]> | undefined;
    /**
     * @protected
     */
    protected initThrottles(): void;
    /**
     * @protected
     */
    protected destroyThrottles(): void;
}
export namespace SCRUBBER_ELEMENT_STORYBOOK_ARG_TYPES {
    const disabled: {
        control: string;
        defaultValue: boolean;
    };
    const hidden: {
        control: string;
        defaultValue: boolean;
    };
    namespace noPreviewClamp {
        const control: string;
        const defaultValue: boolean;
    }
    namespace noPreviewTrack {
        const control_1: string;
        export { control_1 as control };
        const defaultValue_1: boolean;
        export { defaultValue_1 as defaultValue };
    }
    const orientation: {
        control: string;
        options: string[];
        defaultValue: string;
    };
    namespace pauseWhileDragging {
        const control_2: string;
        export { control_2 as control };
        const defaultValue_2: boolean;
        export { defaultValue_2 as defaultValue };
    }
    namespace previewTimeThrottle {
        const control_3: string;
        export { control_3 as control };
        const defaultValue_3: number;
        export { defaultValue_3 as defaultValue };
    }
    namespace progressLabel {
        const control_4: string;
        export { control_4 as control };
        const defaultValue_4: string;
        export { defaultValue_4 as defaultValue };
    }
    namespace progressText {
        const control_5: string;
        export { control_5 as control };
        const defaultValue_5: string;
        export { defaultValue_5 as defaultValue };
    }
    namespace sliderLabel {
        const control_6: string;
        export { control_6 as control };
        const defaultValue_6: string;
        export { defaultValue_6 as defaultValue };
    }
    namespace step {
        const control_7: string;
        export { control_7 as control };
        const defaultValue_7: number;
        export { defaultValue_7 as defaultValue };
    }
    namespace stepMultiplier {
        const control_8: string;
        export { control_8 as control };
        const defaultValue_8: number;
        export { defaultValue_8 as defaultValue };
    }
    namespace throttle {
        const control_9: string;
        export { control_9 as control };
        const defaultValue_9: number;
        export { defaultValue_9 as defaultValue };
    }
    namespace userSeekingThrottle {
        const control_10: string;
        export { control_10 as control };
        const defaultValue_10: number;
        export { defaultValue_10 as defaultValue };
    }
    const onScrubberPreviewShow: {
        action: "vds-scrubber-preview-show";
        table: {
            disable: boolean;
        };
    };
    const onScrubberPreviewHide: {
        action: "vds-scrubber-preview-hide";
        table: {
            disable: boolean;
        };
    };
    const onScrubberPreviewTimeUpdate: {
        action: "vds-scrubber-preview-time-update";
        table: {
            disable: boolean;
        };
    };
    const onPlayRequest: {
        action: "vds-play-request";
        table: {
            disable: boolean;
        };
    };
    const onPauseRequest: {
        action: "vds-pause-request";
        table: {
            disable: boolean;
        };
    };
    const onSeekRequest: {
        action: "vds-seek-request";
        table: {
            disable: boolean;
        };
    };
    const onSeekingRequest: {
        action: "vds-seeking-request";
        table: {
            disable: boolean;
        };
    };
    namespace mediaCurrentTime {
        const control_11: string;
        export { control_11 as control };
        const defaultValue_11: number;
        export { defaultValue_11 as defaultValue };
    }
    namespace mediaDuration {
        const control_12: string;
        export { control_12 as control };
        const defaultValue_12: number;
        export { defaultValue_12 as defaultValue };
    }
    namespace mediaPaused {
        const control_13: string;
        export { control_13 as control };
        const defaultValue_13: boolean;
        export { defaultValue_13 as defaultValue };
    }
    namespace mediaSeekableAmount {
        const control_14: string;
        export { control_14 as control };
        const defaultValue_14: number;
        export { defaultValue_14 as defaultValue };
    }
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
import { MediaRemoteControl } from "../../../media/controller/MediaRemoteControl.js";
import { SliderElement } from "../slider/SliderElement.js";
import { SliderValueChangeEvent } from "../slider/events.js";
import { SliderDragStartEvent } from "../slider/events.js";
import { SliderDragEndEvent } from "../slider/events.js";
