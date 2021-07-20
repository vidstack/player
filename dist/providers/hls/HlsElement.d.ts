export const HLS_ELEMENT_TAG_NAME: "vds-hls";
export const HLS_EXTENSIONS: RegExp;
export const HLS_TYPES: Set<string>;
/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS) via the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library.
 *
 * You'll need to install `hls.js` to use this provider...
 *
 * ```bash
 * $: npm install hls.js@^0.14.0
 * ```
 *
 * @tagname vds-hls
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-hls>
 * ```
 * @example
 * ```html
 *  <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-hls>
 * ```
 */
export class HlsElement extends VideoElement {
    /**
     * The `hls.js` configuration object.
     *
     * @type {Partial<Hls.Config> | undefined}
     */
    hlsConfig: Partial<Hls.Config> | undefined;
    /**
     * @protected
     * @type {Hls | undefined}
     */
    protected _hlsEngine: Hls | undefined;
    /**
     * @protected
     * @type {boolean}
     */
    protected _isHlsEngineAttached: boolean;
    get hlsEngine(): Hls | undefined;
    /**
     * Whether the `hls.js` instance has mounted the `HtmlMediaElement`.
     *
     * @type {boolean}
     * @default false
     */
    get isHlsEngineAttached(): boolean;
    /**
     * Whether the current src is using HLS.
     *
     * @type {boolean}
     * @default false
     */
    get isHlsStream(): boolean;
    /**
     * Whether the browser natively supports HLS, mostly only true in Safari. Only call this method
     * after the provider has connected to the DOM (wait for `ConnectEvent`).
     *
     * @type {boolean}
     */
    get hasNativeHlsSupport(): boolean;
    /**
     * Whether native HLS support is available and whether it should be used. Generally defaults
     * to `false` as long as `window.MediaSource` is defined to enforce consistency by
     * using `hls.js` where ever possible.
     *
     * @type {boolean}
     * @default false
     */
    get shouldUseNativeHlsSupport(): boolean;
    /**
     * @protected
     */
    protected destroyHlsEngine(): void;
    /** @type {string} */
    _prevHlsSrc: string;
    /**
     * @protected
     */
    protected loadSrcOnHlsEngine(): void;
    /**
     * @protected
     */
    protected buildHlsEngine(): void;
    /**
     * @protected
     */
    protected attachHlsEngine(): void;
    /**
     * @protected
     */
    protected detachHlsEngine(): void;
    /**
     * @protected
     */
    protected listenToHlsEngine(): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.errorData} data
     */
    protected handleHlsError(eventType: string, data: Hls.errorData): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.errorData} data
     */
    protected handleHlsNetworkError(eventType: string, data: Hls.errorData): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.errorData} data
     */
    protected handleHlsMediaError(eventType: string, data: Hls.errorData): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.errorData} data
     */
    protected handleHlsIrrecoverableError(eventType: string, data: Hls.errorData): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.levelLoadedData} data
     */
    protected handleHlsLevelLoaded(eventType: string, data: Hls.levelLoadedData): void;
    /**
     * @protected
     * @param {string} eventType
     * @param {Hls.levelLoadedData} data
     */
    protected handleHlsMediaReady(eventType: string, data: Hls.levelLoadedData): void;
}
export const HLS_ELEMENT_STORYBOOK_ARG_TYPES: {
    hlsConfig: {
        control: string;
    };
    src: {
        control: string;
        defaultValue: string;
    };
    onHlsEngineAttach: {
        action: "vds-hls-engine-attach";
        table: {
            disable: boolean;
        };
    };
    onHlsEngineBuilt: {
        action: "vds-hls-engine-built";
        table: {
            disable: boolean;
        };
    };
    onHlsEngineDetach: {
        action: "vds-hls-engine-detach";
        table: {
            disable: boolean;
        };
    };
    onHlsEngineNoSupport: {
        action: "vds-hls-engine-no-support";
        table: {
            disable: boolean;
        };
    };
    autoPiP: {
        /**
         * @protected
         */
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
import { VideoElement } from "../video/VideoElement.js";
import Hls from "hls.js";
