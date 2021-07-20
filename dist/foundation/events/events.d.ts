/**
 * @param {EventTarget} target
 * @param {Event | CustomEvent | VdsCustomEvent} event
 */
export function redispatchEvent(target: EventTarget, event: Event | CustomEvent | VdsCustomEvent<any>): void;
/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {Event} ListenedEvent
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {string} type - The name of the event to listen to.
 * @param {(event: ListenedEvent) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types').Unsubscribe}
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen<ListenedEvent extends Event>(target: EventTarget, type: string, listener: (event: ListenedEvent) => void, options?: boolean | AddEventListenerOptions | EventListenerOptions | undefined): import('../types').Unsubscribe;
/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {keyof GlobalEventHandlersEventMap} EventType
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {EventType} type - The name of the event to listen to.
 * @param {(event: GlobalEventHandlersEventMap[EventType]) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types').Unsubscribe}
 */
export function listenGlobalEvent<EventType extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: EventType, listener: (event: GlobalEventHandlersEventMap[EventType]) => void, options?: boolean | AddEventListenerOptions | EventListenerOptions | undefined): import('../types').Unsubscribe;
/**
 * @typedef {{
 *  [EventType in keyof GlobalEventHandlersEventMap]?: (event: GlobalEventHandlersEventMap[EventType]) => void;
 * }} EventHandlerRecord
 */
/**
 * @param {EventTarget} target
 * @param {EventHandlerRecord} record
 * @param {DisposalBin} disposal
 * @param {{ receiver?: any }} [options]
 */
export function bindEventListeners(target: EventTarget, record: EventHandlerRecord, disposal: DisposalBin, options?: {
    receiver?: any;
} | undefined): void;
/**
 * @template DetailType
 * @typedef {{
 *   readonly originalEvent?: Event;
 * } & CustomEventInit<DetailType>} VdsEventInit
 */
/**
 * @template DetailType
 * @augments CustomEvent<DetailType>
 */
export class VdsCustomEvent<DetailType> extends CustomEvent<DetailType> {
    /**
     * @type {string}
     * @readonly
     */
    static readonly TYPE: string;
    /**
     * @type {boolean}
     * @readonly
     */
    static readonly DEFAULT_BUBBLES: boolean;
    /**
     * @type {boolean}
     * @readonly
     */
    static readonly DEFAULT_COMPOSED: boolean;
    /**
     * @param {VdsEventInit<DetailType>} [eventInit]
     * @param {string} [type]
     * @param {boolean} [final]
     */
    constructor(eventInit?: VdsEventInit<DetailType> | undefined, type?: string | undefined, final?: boolean | undefined);
    /**
     * @type {Event | undefined}
     * @readonly
     */
    readonly originalEvent: Event | undefined;
    /**
     * Walks up the event chain (following each `originalEvent`) and returns the origin event
     * that started the chain.
     *
     * @type {Event | undefined}
     */
    get originEvent(): Event | undefined;
    /**
     * Walks up the event chain (following each `originalEvent`) and determines whether the initial
     * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
     *
     * @type {boolean}
     */
    get isOriginTrusted(): boolean;
}
/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
    /**
     * @protected
     * @type {import('../types').Callback<void>[]}
     */
    protected disposal: import('../types').Callback<void>[];
    /**
     * @param {import('../types').Callback<void>} [callback]
     */
    add(callback?: import("../types").Callback<void> | undefined): void;
    /**
     */
    empty(): void;
}
export type EventHandlerRecord = {
    abort?: ((event: UIEvent) => void) | undefined;
    animationcancel?: ((event: AnimationEvent) => void) | undefined;
    animationend?: ((event: AnimationEvent) => void) | undefined;
    animationiteration?: ((event: AnimationEvent) => void) | undefined;
    animationstart?: ((event: AnimationEvent) => void) | undefined;
    auxclick?: ((event: MouseEvent) => void) | undefined;
    beforeinput?: ((event: InputEvent) => void) | undefined;
    blur?: ((event: FocusEvent) => void) | undefined;
    canplay?: ((event: Event) => void) | undefined;
    canplaythrough?: ((event: Event) => void) | undefined;
    change?: ((event: Event) => void) | undefined;
    click?: ((event: MouseEvent) => void) | undefined;
    close?: ((event: Event) => void) | undefined;
    compositionend?: ((event: CompositionEvent) => void) | undefined;
    compositionstart?: ((event: CompositionEvent) => void) | undefined;
    compositionupdate?: ((event: CompositionEvent) => void) | undefined;
    contextmenu?: ((event: MouseEvent) => void) | undefined;
    cuechange?: ((event: Event) => void) | undefined;
    dblclick?: ((event: MouseEvent) => void) | undefined;
    drag?: ((event: DragEvent) => void) | undefined;
    dragend?: ((event: DragEvent) => void) | undefined;
    dragenter?: ((event: DragEvent) => void) | undefined;
    dragleave?: ((event: DragEvent) => void) | undefined;
    dragover?: ((event: DragEvent) => void) | undefined;
    dragstart?: ((event: DragEvent) => void) | undefined;
    drop?: ((event: DragEvent) => void) | undefined;
    durationchange?: ((event: Event) => void) | undefined;
    emptied?: ((event: Event) => void) | undefined;
    ended?: ((event: Event) => void) | undefined;
    error?: ((event: ErrorEvent) => void) | undefined;
    focus?: ((event: FocusEvent) => void) | undefined;
    focusin?: ((event: FocusEvent) => void) | undefined;
    focusout?: ((event: FocusEvent) => void) | undefined;
    formdata?: ((event: FormDataEvent) => void) | undefined;
    gotpointercapture?: ((event: PointerEvent) => void) | undefined;
    input?: ((event: Event) => void) | undefined;
    invalid?: ((event: Event) => void) | undefined;
    keydown?: ((event: KeyboardEvent) => void) | undefined;
    keypress?: ((event: KeyboardEvent) => void) | undefined;
    keyup?: ((event: KeyboardEvent) => void) | undefined;
    load?: ((event: Event) => void) | undefined;
    loadeddata?: ((event: Event) => void) | undefined;
    loadedmetadata?: ((event: Event) => void) | undefined;
    loadstart?: ((event: Event) => void) | undefined;
    lostpointercapture?: ((event: PointerEvent) => void) | undefined;
    mousedown?: ((event: MouseEvent) => void) | undefined;
    mouseenter?: ((event: MouseEvent) => void) | undefined;
    mouseleave?: ((event: MouseEvent) => void) | undefined;
    mousemove?: ((event: MouseEvent) => void) | undefined;
    mouseout?: ((event: MouseEvent) => void) | undefined;
    mouseover?: ((event: MouseEvent) => void) | undefined;
    mouseup?: ((event: MouseEvent) => void) | undefined;
    pause?: ((event: Event) => void) | undefined;
    play?: ((event: Event) => void) | undefined;
    playing?: ((event: Event) => void) | undefined;
    pointercancel?: ((event: PointerEvent) => void) | undefined;
    pointerdown?: ((event: PointerEvent) => void) | undefined;
    pointerenter?: ((event: PointerEvent) => void) | undefined;
    pointerleave?: ((event: PointerEvent) => void) | undefined;
    pointermove?: ((event: PointerEvent) => void) | undefined;
    pointerout?: ((event: PointerEvent) => void) | undefined;
    pointerover?: ((event: PointerEvent) => void) | undefined;
    pointerup?: ((event: PointerEvent) => void) | undefined;
    progress?: ((event: ProgressEvent<EventTarget>) => void) | undefined;
    ratechange?: ((event: Event) => void) | undefined;
    reset?: ((event: Event) => void) | undefined;
    resize?: ((event: UIEvent) => void) | undefined;
    scroll?: ((event: Event) => void) | undefined;
    securitypolicyviolation?: ((event: SecurityPolicyViolationEvent) => void) | undefined;
    seeked?: ((event: Event) => void) | undefined;
    seeking?: ((event: Event) => void) | undefined;
    select?: ((event: Event) => void) | undefined;
    selectionchange?: ((event: Event) => void) | undefined;
    selectstart?: ((event: Event) => void) | undefined;
    stalled?: ((event: Event) => void) | undefined;
    submit?: ((event: Event) => void) | undefined;
    suspend?: ((event: Event) => void) | undefined;
    timeupdate?: ((event: Event) => void) | undefined;
    toggle?: ((event: Event) => void) | undefined;
    touchcancel?: ((event: TouchEvent) => void) | undefined;
    touchend?: ((event: TouchEvent) => void) | undefined;
    touchmove?: ((event: TouchEvent) => void) | undefined;
    touchstart?: ((event: TouchEvent) => void) | undefined;
    transitioncancel?: ((event: TransitionEvent) => void) | undefined;
    transitionend?: ((event: TransitionEvent) => void) | undefined;
    transitionrun?: ((event: TransitionEvent) => void) | undefined;
    transitionstart?: ((event: TransitionEvent) => void) | undefined;
    volumechange?: ((event: Event) => void) | undefined;
    waiting?: ((event: Event) => void) | undefined;
    webkitanimationend?: ((event: Event) => void) | undefined;
    webkitanimationiteration?: ((event: Event) => void) | undefined;
    webkitanimationstart?: ((event: Event) => void) | undefined;
    webkittransitionend?: ((event: Event) => void) | undefined;
    wheel?: ((event: WheelEvent) => void) | undefined;
    "vds-media-container-connect"?: ((event: import("../../media").MediaContainerConnectEvent) => void) | undefined;
    "vds-media-controller-connect"?: ((event: import("../../media").MediaControllerConnectEvent) => void) | undefined;
    "vds-media-provider-connect"?: ((event: import("../../media").MediaProviderConnectEvent) => void) | undefined;
    "vds-hls-engine-built"?: ((event: import("../../bundle").HlsEngineBuiltEvent) => void) | undefined;
    "vds-hls-engine-detach"?: ((event: import("../../bundle").HlsEngineDetachEvent) => void) | undefined;
    "vds-hls-engine-attach"?: ((event: import("../../bundle").HlsEngineAttachEvent) => void) | undefined;
    "vds-hls-engine-no-support"?: ((event: import("../../bundle").HlsEngineNoSupportEvent) => void) | undefined;
    "vds-abort"?: ((event: import("../../media").AbortEvent) => void) | undefined;
    "vds-can-play"?: ((event: import("../../media").CanPlayEvent) => void) | undefined;
    "vds-can-play-through"?: ((event: import("../../media").CanPlayThroughEvent) => void) | undefined;
    "vds-duration-change"?: ((event: import("../../media").DurationChangeEvent) => void) | undefined;
    "vds-emptied"?: ((event: import("../../media").EmptiedEvent) => void) | undefined;
    "vds-ended"?: ((event: import("../../media").EndedEvent) => void) | undefined;
    "vds-error"?: ((event: import("../../media").ErrorEvent) => void) | undefined;
    "vds-loaded-data"?: ((event: import("../../media").LoadedDataEvent) => void) | undefined;
    "vds-loaded-metadata"?: ((event: import("../../media").LoadedMetadataEvent) => void) | undefined;
    "vds-load-start"?: ((event: import("../../media").LoadStartEvent) => void) | undefined;
    "vds-media-type-change"?: ((event: import("../../media").MediaTypeChangeEvent) => void) | undefined;
    "vds-pause"?: ((event: import("../../media").PauseEvent) => void) | undefined;
    "vds-play"?: ((event: import("../../media").PlayEvent) => void) | undefined;
    "vds-playing"?: ((event: import("../../media").PlayingEvent) => void) | undefined;
    "vds-progress"?: ((event: import("../../media").ProgressEvent) => void) | undefined;
    "vds-seeked"?: ((event: import("../../media").SeekedEvent) => void) | undefined;
    "vds-seeking"?: ((event: import("../../media").SeekingEvent) => void) | undefined;
    "vds-stalled"?: ((event: import("../../media").StalledEvent) => void) | undefined;
    "vds-started"?: ((event: import("../../media").StartedEvent) => void) | undefined;
    "vds-suspend"?: ((event: import("../../media").SuspendEvent) => void) | undefined;
    "vds-replay"?: ((event: import("../../media").ReplayEvent) => void) | undefined;
    "vds-time-update"?: ((event: import("../../media").TimeUpdateEvent) => void) | undefined;
    "vds-view-type-change"?: ((event: import("../../media").ViewTypeChangeEvent) => void) | undefined;
    "vds-volume-change"?: ((event: import("../../media").VolumeChangeEvent) => void) | undefined;
    "vds-waiting"?: ((event: import("../../media").WaitingEvent) => void) | undefined;
    "vds-mute-request"?: ((event: import("../../media").MuteRequestEvent) => void) | undefined;
    "vds-unmute-request"?: ((event: import("../../media").UnmuteRequestEvent) => void) | undefined;
    "vds-enter-fullscreen-request"?: ((event: import("../../media").EnterFullscreenRequestEvent) => void) | undefined;
    "vds-exit-fullscreen-request"?: ((event: import("../../media").ExitFullscreenRequestEvent) => void) | undefined;
    "vds-play-request"?: ((event: import("../../media").PlayRequestEvent) => void) | undefined;
    "vds-pause-request"?: ((event: import("../../media").PauseRequestEvent) => void) | undefined;
    "vds-seek-request"?: ((event: import("../../media").SeekRequestEvent) => void) | undefined;
    "vds-seeking-request"?: ((event: import("../../media").SeekingRequestEvent) => void) | undefined;
    "vds-volume-change-request"?: ((event: import("../../media").VolumeChangeRequestEvent) => void) | undefined;
    "vds-controls-change"?: ((event: import("../../media").ControlsChangeEvent) => void) | undefined;
    "vds-hide-controls-request"?: ((event: import("../../media").HideControlsRequestEvent) => void) | undefined;
    "vds-show-controls-request"?: ((event: import("../../media").ShowControlsRequestEvent) => void) | undefined;
    "vds-idle-change"?: ((event: import("../../media").IdleChangeEvent) => void) | undefined;
    "vds-pause-idle-tracking"?: ((event: import("../../media").PauseIdleTrackingRequestEvent) => void) | undefined;
    "vds-resume-idle-tracking"?: ((event: import("../../media").ResumeIdleTrackingRequestEvent) => void) | undefined;
    "vds-video-presentation-change"?: ((event: import("../../bundle").VideoPresentationChangeEvent) => void) | undefined;
    "vds-fullscreen-change"?: ((event: import("../fullscreen").FullscreenChangeEvent) => void) | undefined;
    "vds-fullscreen-error"?: ((event: import("../fullscreen").FullscreenErrorEvent) => void) | undefined;
    "vds-screen-orientation-change"?: ((event: import("../screen-orientation").ScreenOrientationChangeEvent) => void) | undefined;
    "vds-screen-orientation-lock-change"?: ((event: import("../screen-orientation").ScreenOrientationLockChangeEvent) => void) | undefined;
    "vds-scrubber-preview-show"?: ((event: import("../../bundle").ScrubberPreviewShowEvent) => void) | undefined;
    "vds-scrubber-preview-hide"?: ((event: import("../../bundle").ScrubberPreviewHideEvent) => void) | undefined;
    "vds-scrubber-preview-time-update"?: ((event: import("../../bundle").ScrubberPreviewTimeUpdateEvent) => void) | undefined;
    "vds-slider-value-change"?: ((event: import("../../bundle").SliderValueChangeEvent) => void) | undefined;
    "vds-slider-drag-start"?: ((event: import("../../bundle").SliderDragStartEvent) => void) | undefined;
    "vds-slider-drag-end"?: ((event: import("../../bundle").SliderDragEndEvent) => void) | undefined;
};
export type VdsEventInit<DetailType> = {
    readonly originalEvent?: Event;
} & CustomEventInit<DetailType>;
