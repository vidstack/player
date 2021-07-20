/**
 * @typedef {import('lit').ReactiveElement} MediaEventObserverHost
 */
/**
 * @typedef {{
 *  [P in keyof import('../events').MediaEvents]?: (event: import('../events').MediaEvents[P]) => void;
 *  }} MediaEventHandlerRecord
 */
/**
 * A controller to simplify attaching media event handlers to the nearest media controller. This
 * observer is to observe state on a controller below in the DOM. If the controller is above you
 * in the DOM then consider using `mediaContext`.
 *
 * @example
 * ```ts
 * import { MediaEventObserver, PlayEvent, CanPlayEvent } from '@vidstack/elements';
 *
 * class MyElement extends HTMLElement {
 *   mediaEventObserver = new MediaEventObserver(this, {
 *     [PlayEvent.TYPE]: this.handlePlay,
 *     [CanPlayEvent.TYPE]: this.handleCanPlay
 *   });
 *
 *   handlePlay(event: PlayEvent) {
 *     // ...
 *   }
 *
 *   handleCanPlay(event: CanPlayEvent) {
 *     // ...
 *   }
 * }
 * ```
 */
export class MediaEventObserver {
    /**
     * @param {MediaEventObserverHost} host
     * @param {MediaEventHandlerRecord} eventHandlers
     */
    constructor(host: MediaEventObserverHost, eventHandlers: MediaEventHandlerRecord);
    /**
     * @protected
     * @readonly
     * @type {MediaEventObserverHost}
     */
    protected readonly host: MediaEventObserverHost;
    /**
     * @protected
     * @readonly
     * @type {MediaEventHandlerRecord}
     */
    protected readonly eventHandlers: MediaEventHandlerRecord;
    /**
     * @protected
     * @readonly
     * @type {EventListenerController}
     */
    protected readonly controllerEventListeners: EventListenerController<any>;
    /**
     * @protected
     * @type {EventListenerController}
     */
    protected mediaEventListeners: EventListenerController<any>;
    /**
     * @protected
     * @param {MediaControllerConnectEvent} event
     */
    protected handleMediaControllerConnectEvent(event: MediaControllerConnectEvent): void;
}
export type MediaEventObserverHost = import('lit').ReactiveElement;
export type MediaEventHandlerRecord = {
    "vds-abort"?: ((event: import("../events").AbortEvent) => void) | undefined;
    "vds-can-play"?: ((event: import("../events").CanPlayEvent) => void) | undefined;
    "vds-can-play-through"?: ((event: import("../events").CanPlayThroughEvent) => void) | undefined;
    "vds-duration-change"?: ((event: import("../events").DurationChangeEvent) => void) | undefined;
    "vds-emptied"?: ((event: import("../events").EmptiedEvent) => void) | undefined;
    "vds-ended"?: ((event: import("../events").EndedEvent) => void) | undefined;
    "vds-error"?: ((event: import("../events").ErrorEvent) => void) | undefined;
    "vds-loaded-data"?: ((event: import("../events").LoadedDataEvent) => void) | undefined;
    "vds-loaded-metadata"?: ((event: import("../events").LoadedMetadataEvent) => void) | undefined;
    "vds-load-start"?: ((event: import("../events").LoadStartEvent) => void) | undefined;
    "vds-media-type-change"?: ((event: import("../events").MediaTypeChangeEvent) => void) | undefined;
    "vds-pause"?: ((event: import("../events").PauseEvent) => void) | undefined;
    "vds-play"?: ((event: import("../events").PlayEvent) => void) | undefined;
    "vds-playing"?: ((event: import("../events").PlayingEvent) => void) | undefined;
    "vds-progress"?: ((event: import("../events").ProgressEvent) => void) | undefined;
    "vds-seeked"?: ((event: import("../events").SeekedEvent) => void) | undefined;
    "vds-seeking"?: ((event: import("../events").SeekingEvent) => void) | undefined;
    "vds-stalled"?: ((event: import("../events").StalledEvent) => void) | undefined;
    "vds-started"?: ((event: import("../events").StartedEvent) => void) | undefined;
    "vds-suspend"?: ((event: import("../events").SuspendEvent) => void) | undefined;
    "vds-replay"?: ((event: import("../events").ReplayEvent) => void) | undefined;
    "vds-time-update"?: ((event: import("../events").TimeUpdateEvent) => void) | undefined;
    "vds-view-type-change"?: ((event: import("../events").ViewTypeChangeEvent) => void) | undefined;
    "vds-volume-change"?: ((event: import("../events").VolumeChangeEvent) => void) | undefined;
    "vds-waiting"?: ((event: import("../events").WaitingEvent) => void) | undefined;
};
import { EventListenerController } from "../../foundation/events/EventListenerController.js";
import { MediaControllerConnectEvent } from "./MediaControllerElement.js";
