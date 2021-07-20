export const SLIDER_ELEMENT_TAG_NAME: "vds-slider";
/**
 * The direction to move the thumb, associated with key symbols.
 */
export type SliderKeyDirection = number;
export namespace SliderKeyDirection {
    const Left: number;
    const ArrowLeft: number;
    const Up: number;
    const ArrowUp: number;
    const Right: number;
    const ArrowRight: number;
    const Down: number;
    const ArrowDown: number;
}
/**
 * A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
 * friendly and easily styleable. This component allows users to input numeric values between a
 * minimum and maxmimum value. Generally used in the player for volume or scrubber controls.
 *
 * @see https://github.com/carbon-design-system/carbon-web-components
 * @tagname vds-slider
 * @slot Used to pass in additional content inside the slider.
 * @slot thumb-container - Used to pass content into the thumb container.
 * @slot thumb - Used to pass content inside the thumb.
 * @slot track - Used to pass content inside the track.
 * @slot track-fill - Used to pass content inside the track fill.
 * @csspart root - The component's root element, in this case the slider container (`<div>`).
 * @csspart thumb-container - The container for the slider's handle.
 * @csspart thumb - The slider's handle the user drags left/right (`<div>`).
 * @csspart track - The background of the slider in which the thumb slides along (`<div>`).
 * @csspart track-fill - The part of the track that is currently filled which fills left-to-right (`<div>`).
 * @cssprop --vds-slider-fill-rate - The ratio of the slider that is filled such as `0.3`.
 * @cssprop --vds-slider-fill-value - The current amount the slider is filled such as `30`.
 * @cssprop --vds-slider-fill-percentage - The fill rate expressed as a precetange such as `30%`.
 * @cssprop --vds-slider-thumb-width - The slider handle width.
 * @cssprop --vds-slider-thumb-height - The slider handle height.
 * @cssprop --vds-slider-thumb-bg - The background color of the slider handle.
 * @cssprop --vds-slider-thumb-border-radius - The border radius of the slider handle.
 * @cssprop --vds-slider-thumb-scale - The base scale of thumb when it is inactive, it'll scale to 1 when active.
 * @cssprop --vds-slider-thumb-transition - The CSS transitions to use for the thumb, defaults to `transform 100ms ease-out 0s`.
 * @cssprop --vds-slider-track-height - The height of the slider track.
 * @cssprop --vds-slider-track-bg - The background color of the slider track.
 * @cssprop --vds-slider-track-fill-bg - The background color of the slider track fill.
 * @cssprop --vds-slider-active-color - The slider thumb and track fill background color when focused, active or being dragged.
 * @cssprop --vds-slider-disabled-color - The slider thumb, track, and track fill background color when disabled.
 * @example
 * ```html
 * <vds-slider
 *   min="0"
 *   max="100"
 *   value="50"
 *   throttle="10"
 * ></vds-slider>
 * ```
 * @example
 * ```css
 * vds-slider {
 *   --vds-slider-active-color: pink;
 * }
 *
 * vds-slider::part(thumb) {
 *   box-shadow: transparent 0px 0px 0px 1px inset;
 * }
 *
 * vds-slider::part(track),
 * vds-slider::part(track-fill) {
 *   border-radius: 3px;
 * }
 * ```
 */
export class SliderElement extends VdsElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /**
     * ♿ **ARIA:** The `aria-label` property of the slider.
     *
     * @type {string | undefined}
     */
    label: string | undefined;
    /**
     * The lowest slider value in the range of permitted values.
     *
     * @type {number}
     */
    min: number;
    /**
     * The greatest slider value in the range of permitted values.
     *
     * @type {number}
     */
    max: number;
    /**
     * Whether the slider should be disabled (not-interactable).
     *
     * @type {boolean}
     */
    disabled: boolean;
    /**
     * The current slider value.
     *
     * @type {number}
     */
    value: number;
    /**
     * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
     * `value:max` ratio as a percentage.
     *
     * @type {string | undefined}
     */
    valueText: string | undefined;
    /**
     * ♿ **ARIA:** Indicates the orientation of the slider.
     *
     * @type {'horizontal' | 'vertical'}
     */
    orientation: 'horizontal' | 'vertical';
    /**
     * A number that specifies the granularity that the slider value must adhere to.
     *
     * @type {number}
     */
    step: number;
    /**
     * A number that will be used to multiply the `step` when the `Shift` key is held down and the
     * slider value is changed by pressing `LeftArrow` or `RightArrow`.
     *
     * @type {number}
     */
    stepMultiplier: number;
    /**
     * The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove`
     * events.
     *
     * @type {number}
     */
    throttle: number;
    /** @protected */
    protected _isDragging: boolean;
    /**
     * Whether the current orientation is horizontal.
     *
     * @type {boolean}
     * @default true
     */
    get isOrientationHorizontal(): boolean;
    /**
     * Whether the current orientation is vertical.
     *
     * @type {boolean}
     * @default false
     */
    get isOrientationVertical(): boolean;
    /**
     * Whether the slider thumb is currently being dragged.
     *
     * @type {boolean}
     * @default false
     */
    get isDragging(): boolean;
    /**
     * The current value to range ratio.
     *
     * @type {number}
     * @default 0.5
     * @example
     * `min` = 0
     * `max` = 10
     * `value` = 5
     * `range` = 10 (max - min)
     * `fillRate` = 0.5 (result)
     */
    get fillRate(): number;
    /**
     * The fill rate expressed as a percentage (`fillRate * 100`).
     *
     * @type {number}
     * @default 50
     */
    get fillPercent(): number;
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
    protected renderSlider(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getSliderClassAttr(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getSliderPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit/directives/style-map').StyleInfo}
     */
    protected getSliderStyleMap(): import('lit/directives/style-map').StyleInfo;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handleSliderPointerMove(event: PointerEvent): void;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly thumbContainerRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The thumb container element.
     *
     * @type {HTMLDivElement}
     */
    get thumbContainerElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderThumbContainer(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getValueAsTextFallback(): string;
    /**
     * @protected
     * @returns {string}
     */
    protected getThumbContainerPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderThumbContainerSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @param {KeyboardEvent} event
     */
    protected handleThumbContainerKeydown(event: KeyboardEvent): void;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handleThumbContainerPointerDown(event: PointerEvent): void;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly thumbRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The thumb element.
     *
     * @type {HTMLDivElement}
     */
    get thumbElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderThumb(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getThumbPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderThumbSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly trackRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The track element.
     *
     * @type {HTMLDivElement}
     */
    get trackElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTrack(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTrackSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getTrackPartAttr(): string;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly trackFillRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The track fill element.
     *
     * @type {HTMLDivElement}
     */
    get trackFillElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTrackFill(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderTrackFillSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getTrackFillPartAttr(): string;
    /**
     * Why? Used to emit native `input` events.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderInput(): import('lit').TemplateResult;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected startDragging(event: PointerEvent): void;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected stopDragging(event: PointerEvent): void;
    /**
     * @protected
     * @type {import('../../../utils/timing').ThrottledFunction<Parameters<SliderElement['handlePointerMove']>> | undefined}
     */
    protected pointerMoveThrottle: import('../../../utils/timing').ThrottledFunction<Parameters<SliderElement['handlePointerMove']>> | undefined;
    /**
     * @protected
     * @readonly
     */
    protected readonly documentEventListeners: EventListenerController<{
        pointerup: (event: PointerEvent) => void;
        pointermove: (event: PointerEvent) => void;
    }>;
    /**
     * @protected
     */
    protected initPointerMoveThrottle(): void;
    /**
     * @protected
     */
    protected destroyPointerMoveThrottle(): void;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handleDocumentPointerUp(event: PointerEvent): void;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handleDocumentPointerMove(event: PointerEvent): void;
    /**
     * @protected
     * @param {PointerEvent} event
     */
    protected handlePointerMove(event: PointerEvent): void;
    /**
     * @protected
     * @param {number} rate
     */
    protected updateValueByRate(rate: number): void;
    /**
     * @protected
     * @param {PointerEvent} event
     * @param {boolean} [shouldFireValueChange=true]
     */
    protected updateValueBasedOnThumbPosition(event: PointerEvent, shouldFireValueChange?: boolean | undefined): void;
}
export namespace SLIDER_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace disabled {
        const control: string;
        const defaultValue: boolean;
    }
    namespace hidden {
        const control_1: string;
        export { control_1 as control };
        const defaultValue_1: boolean;
        export { defaultValue_1 as defaultValue };
    }
    namespace label {
        const control_2: string;
        export { control_2 as control };
    }
    namespace max {
        const control_3: string;
        export { control_3 as control };
        const defaultValue_2: number;
        export { defaultValue_2 as defaultValue };
    }
    namespace min {
        const control_4: string;
        export { control_4 as control };
        const defaultValue_3: number;
        export { defaultValue_3 as defaultValue };
    }
    namespace orientation {
        const control_5: string;
        export { control_5 as control };
        export const options: string[];
        const defaultValue_4: string;
        export { defaultValue_4 as defaultValue };
    }
    namespace step {
        const control_6: string;
        export { control_6 as control };
        const defaultValue_5: number;
        export { defaultValue_5 as defaultValue };
    }
    namespace stepMultiplier {
        const control_7: string;
        export { control_7 as control };
        const defaultValue_6: number;
        export { defaultValue_6 as defaultValue };
    }
    namespace throttle {
        const control_8: string;
        export { control_8 as control };
        const defaultValue_7: number;
        export { defaultValue_7 as defaultValue };
    }
    namespace value {
        const control_9: string;
        export { control_9 as control };
        const defaultValue_8: number;
        export { defaultValue_8 as defaultValue };
    }
    namespace valueText {
        const control_10: string;
        export { control_10 as control };
    }
    const onSliderDragStart: {
        action: "vds-slider-drag-start";
        table: {
            disable: boolean;
        };
    };
    const onSliderDragEnd: {
        action: "vds-slider-drag-end";
        table: {
            disable: boolean;
        };
    };
    const onSliderValueChange: {
        action: "vds-slider-value-change";
        table: {
            disable: boolean;
        };
    };
}
import { VdsElement } from "../../../foundation/elements/VdsElement.js";
import { EventListenerController } from "../../../foundation/events/EventListenerController.js";
