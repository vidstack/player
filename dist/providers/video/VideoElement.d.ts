export const VIDEO_ELEMENT_TAG_NAME: "vds-video";
export const AUDIO_EXTENSIONS: RegExp;
export const VIDEO_EXTENSIONS: RegExp;
/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element.
 *
 * @tagname vds-video
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 * @example
 * ```html
 * <vds-video src="/media/video.mp4" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video poster="/media/poster.png">
 *   <source src="/media/video.mp4" type="video/mp4" />
 *   <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 * </vds-video>
 * ```
 */
export class VideoElement extends Html5MediaElement {
    /** @type {import('lit').CSSResultGroup} */
    static get styles(): import("lit").CSSResultGroup;
    /**
     * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
     * the user switches back and forth between this document and another document or application.
     *
     * @type {boolean | undefined}
     */
    autoPiP: boolean | undefined;
    /**
     * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
     * to request picture-in-picture automatically in some cases.
     *
     * @type {boolean | undefined}
     * @link https://w3c.github.io/picture-in-picture/#disable-pip
     */
    disablePiP: boolean | undefined;
    set poster(arg: string);
    /**
     * A URL for an image to be shown while the video is downloading. If this attribute isn't
     * specified, nothing is displayed until the first frame is available, then the first frame is
     * shown as the poster frame.
     *
     * @type {string}
     */
    get poster(): string;
    get videoElement(): HTMLVideoElement;
    get videoEngine(): HTMLVideoElement;
    /**
     * Override this to modify root provider CSS Classes.
     *
     * @protected
     * @returns {string}
     */
    protected getRootClassAttr(): string;
    /**
     * Override this to modify root provider CSS Parts.
     *
     * @protected
     * @returns {string}
     */
    protected getRootPartAttr(): string;
    /**
     * Override this to modify video CSS Parts.
     *
     * @protected
     * @returns {string}
     */
    protected getVideoPartAttr(): string;
    /**
     * Can be used by attaching engine such as `hls.js` to prevent src attr being set on
     * `<video>` element.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldSetVideoSrcAttr(): boolean;
    /**
     * @protected
     * @returns {import('lit').TemplateResult}
     */
    protected renderVideo(): import('lit').TemplateResult;
    /**
     * @protected
     * @returns {MediaType}
     */
    protected getMediaType(): MediaType;
    /**
     * Issues an asynchronous request to display the video in picture-in-picture mode.
     *
     * It's not guaranteed that the video will be put into picture-in-picture. If permission to enter
     * that mode is granted, the returned `Promise` will resolve and the video will receive a
     * `enterpictureinpicture` event to let it know that it's now in picture-in-picture.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture
     * @returns {Promise<PictureInPictureWindow>}
     */
    requestPictureInPicture(): Promise<PictureInPictureWindow>;
    presentationController: VideoPresentationController;
}
export const VIDEO_ELEMENT_STORYBOOK_ARG_TYPES: {
    autoPiP: {
        control: string;
    };
    controlsList: {
        control: string;
    };
    crossOrigin: {
        control: string;
    };
    defaultMuted: {
        control: string;
    };
    defaultPlaybackRate: {
        control: string;
    };
    disablePiP: {
        control: string;
    };
    disableRemotePlayback: {
        control: string;
    };
    height: {
        control: string;
    };
    poster: {
        control: string;
        defaultValue: string;
    };
    preload: {
        control: string;
    };
    src: {
        control: string;
        defaultValue: string;
    };
    srcObject: {
        control: string;
    };
    width: {
        control: string;
    };
    autoplay: {
        control: boolean;
    };
    controls: {
        control: string;
        defaultValue: boolean;
    };
    currentTime: {
        control: string;
        defaultValue: number;
    };
    loop: {
        control: string;
    };
    muted: {
        control: string;
    };
    paused: {
        control: string;
        defaultValue: boolean;
    };
    playsinline: {
        control: string;
    };
    volume: {
        control: string;
        defaultValue: number;
    };
    onAbort: {
        action: "vds-abort";
        table: {
            disable: boolean;
        };
    };
    onCanPlay: {
        action: "vds-can-play";
        table: {
            disable: boolean;
        };
    };
    onCanPlayThrough: {
        action: "vds-can-play-through";
        table: {
            disable: boolean;
        };
    };
    onDurationChange: {
        action: "vds-duration-change";
        table: {
            disable: boolean;
        };
    };
    onEmptied: {
        action: "vds-emptied";
        table: {
            disable: boolean;
        };
    };
    onEnded: {
        action: "vds-ended";
        table: {
            disable: boolean;
        };
    };
    onError: {
        action: "vds-error";
        table: {
            disable: boolean;
        };
    };
    onFullscreenChange: {
        action: "vds-fullscreen-change";
        table: {
            disable: boolean;
        };
    };
    onLoadedData: {
        action: "vds-loaded-data";
        table: {
            disable: boolean;
        };
    };
    onLoadedMetadata: {
        action: "vds-loaded-metadata";
        table: {
            disable: boolean;
        };
    };
    onLoadStart: {
        action: "vds-load-start";
        table: {
            disable: boolean;
        };
    };
    onMediaTypeChange: {
        action: "vds-media-type-change";
        table: {
            disable: boolean;
        };
    };
    onPause: {
        action: "vds-pause";
        table: {
            disable: boolean;
        };
    };
    onPlay: {
        action: "vds-play";
        table: {
            disable: boolean;
        };
    };
    onPlaying: {
        action: "vds-playing";
        table: {
            disable: boolean;
        };
    };
    onProgress: {
        action: "vds-progress";
        table: {
            disable: boolean;
        };
    };
    onReplay: {
        action: "vds-replay";
        table: {
            disable: boolean;
        };
    };
    onSeeked: {
        action: "vds-seeked";
        table: {
            disable: boolean;
        };
    };
    onSeeking: {
        action: "vds-seeking";
        table: {
            disable: boolean;
        };
    };
    onStalled: {
        action: "vds-stalled";
        table: {
            disable: boolean;
        };
    };
    onStarted: {
        action: "vds-started";
        table: {
            disable: boolean;
        };
    };
    onSuspend: {
        action: "vds-suspend";
        table: {
            disable: boolean;
        };
    };
    onTimeUpdate: {
        action: "vds-time-update";
        table: {
            disable: boolean;
        };
    };
    onViewTypeChange: {
        action: "vds-view-type-change";
        table: {
            disable: boolean;
        };
    };
    onVolumeChange: {
        action: "vds-volume-change";
        table: {
            disable: boolean;
        };
    };
    onWaiting: {
        action: "vds-waiting";
        table: {
            disable: boolean;
        };
    };
    onMediaProviderConnect: {
        action: "vds-media-provider-connect";
        table: {
            disable: boolean;
        };
    };
};
import { Html5MediaElement } from "../html5/Html5MediaElement.js";
import { MediaType } from "../../media/MediaType.js";
import { VideoPresentationController } from "./presentation/VideoPresentationController.js";
