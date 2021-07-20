/**
 * @typedef {{
 *  [SliderValueChangeEvent.TYPE]: SliderValueChangeEvent;
 *  [SliderDragStartEvent.TYPE]: SliderDragStartEvent;
 *  [SliderDragEndEvent.TYPE]: SliderDragEndEvent;
 * }} SliderEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class SliderEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the slider value changes.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderValueChangeEvent extends SliderEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-slider-value-change";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the user begins interacting with the slider and dragging the thumb.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderDragStartEvent extends SliderEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-slider-drag-start";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the user stops dragging the slider thumb.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderDragEndEvent extends SliderEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-slider-drag-end";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type SliderEvents = {
    [SliderValueChangeEvent.TYPE]: SliderValueChangeEvent;
    [SliderDragStartEvent.TYPE]: SliderDragStartEvent;
    [SliderDragEndEvent.TYPE]: SliderDragEndEvent;
};
import { VdsCustomEvent } from "../../../foundation/events/events.js";
