import { property } from 'lit/decorators.js';

import { VdsCustomEvent } from '../../foundation/events/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import {
  CanPlay,
  DurationChangeEvent,
  ErrorEvent,
  MediaType,
  MediaTypeChangeEvent
} from '../../media/index.js';
import { preconnect } from '../../utils/network.js';
import { isNil, isString, isUndefined } from '../../utils/unit.js';
import {
  VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  VideoElement
} from '../video/index.js';
import {
  HlsEngineAttachEvent,
  HlsEngineBuiltEvent,
  HlsEngineDetachEvent,
  HlsEngineNoSupportEvent
} from './events.js';

export const HLS_ELEMENT_TAG_NAME = 'vds-hls';

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

export const HLS_TYPES = new Set([
  'application/x-mpegURL',
  'application/vnd.apple.mpegurl'
]);

/**
 * @typedef {typeof import('hls.js')} Hls
 */

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
 * @csspart media - The video element (`<video>`).
 * @csspart video - Alias for `media` part.
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
  /** @type {string[]} */
  static get events() {
    return [
      ...(super.events ?? []),
      HlsEngineAttachEvent.TYPE,
      HlsEngineBuiltEvent.TYPE,
      HlsEngineDetachEvent.TYPE,
      HlsEngineNoSupportEvent.TYPE
    ];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The `hls.js` configuration object.
   *
   * @type {Partial<import('hls.js').Config> | undefined}
   */
  @property({ type: Object, attribute: 'hls-config' })
  hlsConfig;

  /**
   * The `hls.js` constructor or a URL of where it can be found. Only version `^0.13.3`
   * (note the `^`) is supported at the moment. Important to note that by default this
   * points towards a development friendly version, swap to `hls.min.js` in production.
   *
   * @type {Hls | string}
   */
  @property({ attribute: 'hls-library' })
  hlsLibrary = 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js';

  /**
   * @protected
   * @type {Hls | undefined}
   */
  _Hls;

  /**
   * The `hls.js` constructor.
   *
   * @type {Hls | undefined}
   */
  get Hls() {
    const Hls = /** @type {Hls} */ (this.hlsLibrary);
    return !isUndefined(Hls.Events.MANIFEST_PARSED) ? Hls : this._Hls;
  }

  /**
   * @protected
   * @type {import('hls.js') | undefined}
   */
  _hlsEngine;

  /**
   * @protected
   * @type {boolean}
   */
  _isHlsEngineAttached = false;

  /**
   * The current `hls.js` instance.
   */
  get hlsEngine() {
    return this._hlsEngine;
  }

  /**
   * Whether the `hls.js` instance has mounted the `HtmlMediaElement`.
   *
   * @type {boolean}
   * @default false
   */
  get isHlsEngineAttached() {
    return this._isHlsEngineAttached;
  }

  get currentSrc() {
    return this.isHlsStream && !this.shouldUseNativeHlsSupport
      ? this.src
      : this.videoEngine?.currentSrc ?? '';
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this.initiateHlsConnection();
  }

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    // TODO: setup HLS
  }

  disconnectedCallback() {
    this.destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  initiateHlsConnection() {
    if (isString(this.hlsLibrary)) {
      preconnect(this.hlsLibrary);
    }
  }

  /**
   * @param {string} type
   * @returns {CanPlay}
   */
  canPlayType(type) {
    if (HLS_TYPES.has(type)) {
      this.isHlsSupported ? CanPlay.Probably : CanPlay.No;
    }

    return super.canPlayType(type);
  }

  /**
   * Whether HLS streaming is supported in this environment. If the `hls.js` library
   * has not loaded it'll defer to a best guess by checking if `MediaSource` is available.
   *
   * @returns {boolean}
   */
  get isHlsSupported() {
    // TODO: when we fallback to native support in stage-2 use this.
    // return this.hasNativeHlsSupport
    return this.Hls?.isSupported() ?? 'MediaSource' in window;
  }

  /**
   * Whether the current src is using HLS.
   *
   * @type {boolean}
   * @default false
   */
  get isHlsStream() {
    return HLS_EXTENSIONS.test(this.src);
  }

  /**
   * Whether the browser natively supports HLS, mostly only true in Safari. Only call this method
   * after the provider has connected to the DOM (wait for `ConnectEvent`).
   *
   * @type {boolean}
   */
  get hasNativeHlsSupport() {
    /**
     * We need to call this directly on `HTMLMediaElement`, calling `this.shouldPlayType(...)`
     * won't work here because it'll use the `CanPlayType` result from this provider override
     * which will incorrectly indicate that HLS can natively played due to `hls.js` support.
     */
    const canPlayType = super.canPlayType('application/vnd.apple.mpegurl');
    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  /**
   * Whether native HLS support is available and whether it should be used. Generally defaults
   * to `false` as long as `window.MediaSource` is defined to enforce consistency by
   * using `hls.js` where ever possible.
   *
   * @type {boolean}
   * @default false
   */
  get shouldUseNativeHlsSupport() {
    // TODO: stage-2 we'll need to rework this line.
    if (this.isHlsSupported) return false;
    return this.hasNativeHlsSupport;
  }

  /**
   * Notifies the `VideoElement` whether the `src` attribute should be set on the rendered
   * `<video>` element. If we're using `hls.js` we don't want to override the `blob`.
   *
   * @protected
   * @returns {boolean}
   */
  shouldSetVideoSrcAttr() {
    return this.shouldUseNativeHlsSupport || !this.isHlsStream;
  }

  /**
   * @protected
   */
  destroyHlsEngine() {
    this.hlsEngine?.destroy();
    this._prevHlsSrc = '';
    this._isHlsEngineAttached = false;
    this.softResetMediaContext();
  }

  /** @type {string} */
  _prevHlsSrc = '';

  /**
   * @protected
   */
  loadSrcOnHlsEngine() {
    if (
      isNil(this.hlsEngine) ||
      !this.isHlsStream ||
      this.shouldUseNativeHlsSupport ||
      this.src === this._prevHlsSrc
    )
      return;

    this.hlsEngine.loadSource(this.src);
    this._prevHlsSrc = this.src;
  }

  /**
   * @protected
   * @type {boolean}
   */
  isInitializingHlsEngine = false;

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async buildHlsEngine() {
    if (
      isNil(this.videoEngine) ||
      !isUndefined(this.hlsEngine) ||
      this.isInitializingHlsEngine
    ) {
      return;
    }

    // TODO: CONTINUE FROM HERE.

    if (!Hls.isSupported()) {
      this.dispatchEvent(new HlsEngineNoSupportEvent());
      return;
    }

    this._hlsEngine = new Hls(this.hlsConfig ?? {});
    this.dispatchEvent(new HlsEngineBuiltEvent({ detail: this.hlsEngine }));
    this.listenToHlsEngine();
  }

  /**
   * @protected
   * @returns {boolean}
   */
  // Let `Html5MediaElement` know we're taking over ready events.
  willAnotherEngineAttach() {
    return this.isHlsStream && !this.shouldUseNativeHlsSupport;
  }

  /**
   * @protected
   */
  attachHlsEngine() {
    if (
      this.isHlsEngineAttached ||
      isUndefined(this.hlsEngine) ||
      isNil(this.videoEngine)
    )
      return;

    this.hlsEngine.attachMedia(this.videoEngine);
    this._isHlsEngineAttached = true;
    this.dispatchEvent(new HlsEngineAttachEvent({ detail: this.hlsEngine }));
  }

  /**
   * @protected
   */
  detachHlsEngine() {
    if (!this.isHlsEngineAttached) return;
    this.hlsEngine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsSrc = '';
    this.dispatchEvent(new HlsEngineDetachEvent({ detail: this.hlsEngine }));
  }

  /**
   * @protected
   * @returns {MediaType}
   */
  getMediaType() {
    if (this.context.isLiveVideo) {
      return MediaType.LiveVideo;
    }

    if (this.isHlsStream) {
      return MediaType.Video;
    }

    return super.getMediaType();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @param {Event} event
   */
  handleLoadedMetadata(event) {
    super.handleLoadedMetadata(event);
    // iOS doesn't fire `canplay` event when loading HLS videos natively.
    if (this.shouldUseNativeHlsSupport && this.isHlsStream) {
      this.handleCanPlay(event);
    }
  }

  /**
   * @protected
   */
  handleMediaSrcChange() {
    super.handleMediaSrcChange();

    this.context.canPlay = false;

    if (!this.isHlsStream) {
      this.detachHlsEngine();
      return;
    }

    // Need to wait for `src` attribute on `<video>` to clear if last `src` was not using HLS engine.
    window.requestAnimationFrame(async () => {
      this.requestUpdate();

      await this.updateComplete;

      if (isUndefined(this.hlsEngine)) {
        this.buildHlsEngine();
      }

      this.attachHlsEngine();
      this.loadSrcOnHlsEngine();
    });
  }

  /**
   * @protected
   */
  listenToHlsEngine() {
    if (isUndefined(this.hlsEngine)) return;

    // TODO: Bind all events.

    this.hlsEngine.on(
      Hls.Events.LEVEL_LOADED,
      this.handleHlsLevelLoaded.bind(this)
    );

    this.hlsEngine.on(Hls.Events.ERROR, this.handleHlsError.bind(this));
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  handleHlsError(eventType, data) {
    this.context.error = data;

    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          this.handleHlsNetworkError(eventType, data);
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this.handleHlsMediaError(eventType, data);
          break;
        default:
          this.handleHlsIrrecoverableError(eventType, data);
          break;
      }
    }

    this.dispatchEvent(
      new ErrorEvent({
        originalEvent: new VdsCustomEvent({ detail: data }, eventType)
      })
    );
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  handleHlsNetworkError(eventType, data) {
    this.hlsEngine?.startLoad();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  handleHlsMediaError(eventType, data) {
    this.hlsEngine?.recoverMediaError();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  handleHlsIrrecoverableError(eventType, data) {
    this.destroyHlsEngine();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.levelLoadedData} data
   */
  handleHlsLevelLoaded(eventType, data) {
    if (this.context.canPlay) return;
    this.handleHlsMediaReady(eventType, data);
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.levelLoadedData} data
   */
  handleHlsMediaReady(eventType, data) {
    const { live, totalduration: duration } = data.details;

    const event = new VdsCustomEvent({ detail: data }, eventType);

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.context.mediaType !== mediaType) {
      this.context.mediaType = mediaType;
      this.dispatchEvent(
        new MediaTypeChangeEvent({ detail: mediaType, originalEvent: event })
      );
    }

    if (this.context.duration !== duration) {
      this.context.duration = duration;
      this.dispatchEvent(
        new DurationChangeEvent({ detail: duration, originalEvent: event })
      );
    }

    this.handleMediaReady(event);
  }
}

export const HLS_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  hlsConfig: { control: StorybookControl.Object },
  src: {
    control: StorybookControl.Text,
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8'
  },
  onHlsEngineAttach: storybookAction(HlsEngineAttachEvent.TYPE),
  onHlsEngineBuilt: storybookAction(HlsEngineBuiltEvent.TYPE),
  onHlsEngineDetach: storybookAction(HlsEngineDetachEvent.TYPE),
  onHlsEngineNoSupport: storybookAction(HlsEngineNoSupportEvent.TYPE)
};
