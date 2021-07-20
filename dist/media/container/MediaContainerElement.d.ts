export const MEDIA_CONTAINER_ELEMENT_TAG_NAME: "vds-media-container";
/**
 * Fired when the media container connects to the DOM.
 *
 * @bubbles
 * @composed
 * @augments {DiscoveryEvent<MediaContainerElement>}
 */
export class MediaContainerConnectEvent extends DiscoveryEvent<MediaContainerElement> {
    /** @readonly */
    static readonly TYPE: "vds-media-container-connect";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<import("../../foundation/elements/index.js").DiscoveryEventDetail<MediaContainerElement>> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Simple container for a media provider and the media user interface (UI).
 *
 *
 * @tagname vds-media-container
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 * @csspart root - The component's root element (`<div>`).
 * @csspart media - The media container element (`<div>`).
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
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
    static get styles(): import("lit").CSSResultGroup;
    /** @type {import('lit').PropertyDeclarations} */
    static get properties(): import("lit").PropertyDeclarations;
    /** @type {import('../../foundation/context/types').ContextConsumerDeclarations} */
    static get contextConsumers(): import("../../foundation/context/types").ContextConsumerDeclarations<any>;
    /**
     * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
     * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
     *
     * @type {string | undefined}
     */
    aspectRatio: string | undefined;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaCanPlay: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaFullscreen: boolean;
    /**
     * @protected
     * @type {boolean}
     */
    protected mediaIsVideoView: boolean;
    /**
     * @protected
     * @readonly
     */
    protected readonly discoveryController: ElementDiscoveryController<MediaContainerElement>;
    /**
     * @protected
     * @readonly
     */
    protected readonly eventListenerController: EventListenerController<{
        "vds-fullscreen-change": (event: FullscreenChangeEvent) => void;
        "vds-media-provider-connect": (event: MediaProviderConnectEvent) => void;
    }>;
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
     * Override this to modify the content rendered inside the root cotnainer.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderRootChildren(): import('lit').TemplateResult;
    /**
     * Override this to modify rendering of default slot.
     *
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderDefaultSlot(): import('lit').TemplateResult;
    /**
     * Override this to modify root container CSS Classes.
     *
     * @protected
     * @returns {string}
     */
    protected getRootClassAttr(): string;
    /**
     * Override this to modify root container CSS parts.
     *
     * @protected
     * @returns {string}
     */
    protected getRootPartAttr(): string;
    /**
     * Override this to modify root container styles.
     *
     * @protected
     * @returns {import('lit/directives/style-map').StyleInfo}
     */
    protected getRootStyleMap(): import('lit/directives/style-map').StyleInfo;
    /**
     * @protected
     * @returns {'true' | 'false'}
     */
    protected getAriaBusy(): 'true' | 'false';
    /**
     * @protected
     * @returns {boolean}
     */
    protected shouldApplyAspectRatio(): boolean;
    /**
     * @protected
     * @returns {number}
     */
    protected calcAspectRatio(): number;
    /**
     * @protected
     * @param {string} maxPadding
     * @returns {string | undefined}
     */
    protected getAspectRatioPadding(maxPadding?: string): string | undefined;
    /**
     * @protected
     * @type {MediaProviderElement | undefined}
     */
    protected _mediaProvider: MediaProviderElement | undefined;
    get mediaProvider(): MediaProviderElement | undefined;
    /**
     * @protected
     * @readonly
     * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
     */
    protected readonly mediaContainerRef: import('lit/directives/ref').Ref<HTMLDivElement>;
    /**
     * The media container element.
     *
     * @type {HTMLDivElement}
     */
    get mediaContainerElement(): HTMLDivElement;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderMedia(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getMediaPartAttr(): string;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderMediaSlot(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {string}
     */
    protected getMediaSlotName(): string;
    /**
     * @protected
     * @type {boolean}
     */
    protected hasMediaProviderConnectedViaEvent: boolean;
    /**
     * @protected
     */
    protected handleMediaSlotChange(): void;
    /**
     * @protected
     * @param {MediaProviderConnectEvent} event
     */
    protected handleMediaProviderConnect(event: MediaProviderConnectEvent): void;
    /**
     * @readonly
     */
    readonly fullscreenController: FullscreenController;
    /**
     * @returns {Promise<void>}
     */
    exitFullscreen(): Promise<void>;
    /**
     * Whether to fallback to attempting fullscreen directly on the media provider if the native
     * Fullscreen API is not available. For example, on iOS Safari this will handle managing
     * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldFullscreenMediaProvider(): boolean;
    /**
     * @protected
     * @param {FullscreenChangeEvent} event
     */
    protected handleFullscreenChange(event: FullscreenChangeEvent): void;
}
export namespace MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES {
    namespace aspectRatio {
        const control: string;
    }
    const onMediaContainerConnect: {
        action: "vds-media-container-connect";
        table: {
            disable: boolean;
        };
    };
}
import { DiscoveryEvent } from "../../foundation/elements/discovery/events.js";
import { VdsElement } from "../../foundation/elements/VdsElement.js";
import { ElementDiscoveryController } from "../../foundation/elements/discovery/ElementDiscoveryController.js";
import { FullscreenChangeEvent } from "../../foundation/fullscreen/events.js";
import { MediaProviderConnectEvent } from "../provider/MediaProviderElement.js";
import { EventListenerController } from "../../foundation/events/EventListenerController.js";
import { MediaProviderElement } from "../provider/MediaProviderElement.js";
import { FullscreenController } from "../../foundation/fullscreen/FullscreenController.js";
