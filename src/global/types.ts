// -------------------------------------------------------------------------------------------
// Global Events
// -------------------------------------------------------------------------------------------

import type { ContextConsumerConnectEvent } from '../base/context';
import { FullscreenEvents } from '../base/fullscreen';
import { ScreenOrientationEvents } from '../base/screen-orientation';
import {
  MediaControllerConnectEvent,
  MediaEvents,
  MediaPlayerConnectEvent,
  MediaProviderConnectEvent,
  MediaRequestEvents
} from '../media';
import { HlsEvents } from '../providers/hls';
import { VideoPresentationEvents } from '../providers/video';
import {
  ScrubberPreviewConnectEvent,
  ScrubberPreviewEvents
} from '../ui/scrubber-preview';
import { SliderEvents } from '../ui/slider';

declare global {
  interface GlobalEventHandlersEventMap
    extends FullscreenEvents,
      HlsEvents,
      MediaEvents,
      MediaRequestEvents,
      ScreenOrientationEvents,
      ScrubberPreviewEvents,
      SliderEvents,
      VideoPresentationEvents {
    'vds-noop': any;
    'vds-context-consumer-connect': ContextConsumerConnectEvent;
    'vds-media-player-connect': MediaPlayerConnectEvent;
    'vds-media-controller-connect': MediaControllerConnectEvent;
    'vds-media-provider-connect': MediaProviderConnectEvent;
    'vds-scrubber-preview-connect': ScrubberPreviewConnectEvent;
  }
}

// -------------------------------------------------------------------------------------------
// Env
// -------------------------------------------------------------------------------------------

declare global {
  const __DEV__: true;
}

// -------------------------------------------------------------------------------------------
// Media
// -------------------------------------------------------------------------------------------

declare global {
  interface Document {
    readonly pictureInPictureEnabled: boolean;
  }

  type WebKitPresentationMode = 'picture-in-picture' | 'inline' | 'fullscreen';

  interface Window {
    readonly chrome: boolean;
    readonly safari: boolean;
    readonly WebKitMediaSource: typeof MediaSource | undefined;
    readonly WebKitSourceBuffer: typeof SourceBuffer | undefined;
  }

  interface HTMLMediaElement {
    captureStream?(): MediaStream;
  }

  interface HTMLVideoElement {
    disablePictureInPicture: boolean;

    /**
     * A Boolean value indicating whether the video is displaying in fullscreen mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1630493-webkitdisplayingfullscreen
     */
    readonly webkitDisplayingFullscreen?: boolean;

    /**
     * A Boolean value indicating whether the video can be played in fullscreen mode.
     *
     * `true` if the device supports fullscreen mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
     */
    readonly webkitSupportsFullscreen?: boolean;

    /**
     * A Boolean value indicating whether wireless video playback is disabled.
     */
    readonly webkitWirelessVideoPlaybackDisabled?: boolean;

    /**
     * A property indicating the presentation mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
     */
    readonly webkitPresentationMode?: WebKitPresentationMode;

    /**
     * Enters fullscreen mode.
     *
     * This method throws an exception if the element is not allowed to enter fullscreen—that is,
     * if `webkitSupportsFullscreen` is false.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
     */
    webkitEnterFullscreen?(): void;

    /**
     * Exits fullscreen mode.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629468-webkitexitfullscreen
     */
    webkitExitFullscreen?(): void;

    /**
     * A Boolean value indicating whether the video can be played in presentation mode.
     *
     * `true` if the device supports presentation mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629816-webkitsupportspresentationmode
     */
    webkitSupportsPresentationMode?(mode: WebKitPresentationMode): boolean;

    /**
     * Sets the presentation mode for video playback.
     *
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631224-webkitsetpresentationmode
     */
    webkitSetPresentationMode?(mode: WebKitPresentationMode): Promise<void>;
  }

  interface PictureInPictureWindowEventMap {
    resize: Event;
  }

  interface PictureInPictureWindow extends EventTarget {
    readonly height: number;
    onresize: ((this: PictureInPictureWindow, ev: Event) => any) | null;
    readonly width: number;
    addEventListener<K extends keyof PictureInPictureWindowEventMap>(
      type: K,
      listener: (
        this: PictureInPictureWindow,
        ev: PictureInPictureWindowEventMap[K]
      ) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof PictureInPictureWindowEventMap>(
      type: K,
      listener: (
        this: PictureInPictureWindow,
        ev: PictureInPictureWindowEventMap[K]
      ) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}

// -------------------------------------------------------------------------------------------
// FormData
// -------------------------------------------------------------------------------------------

declare global {
  interface FormDataEvent extends Event {
    /**
     * Returns a FormData object representing names and values of elements associated to the target
     * form. Operations on the FormData object will affect form data to be submitted.
     */
    readonly formData: FormData;
  }
}

// -------------------------------------------------------------------------------------------
// ResizeObserver
// -------------------------------------------------------------------------------------------

export interface ResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), and `border-box`.
   *
   * @default 'content-box'
   */
  box?: 'content-box' | 'border-box';
}

export interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

export declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void;

export interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}
