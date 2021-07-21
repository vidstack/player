import { property } from 'lit/decorators.js';

import { VdsCustomEvent } from '../../foundation/events/index.js';
import {
  CanPlay,
  DurationChangeEvent,
  ErrorEvent,
  MediaType,
  MediaTypeChangeEvent
} from '../../media/index.js';
import { preconnect, ScriptLoader } from '../../utils/network.js';
import { isNonNativeHlsStreamingPossible } from '../../utils/support.js';
import { isFunction, isNil, isString, isUndefined } from '../../utils/unit.js';
import { VideoElement } from '../video/index.js';
import {
  HlsAttachEvent,
  HlsBuildEvent,
  HlsDetachEvent,
  HlsLoadErrorEvent,
  HlsLoadEvent,
  HlsNoSupportEvent
} from './events.js';

export const HLS_ELEMENT_TAG_NAME = 'vds-hls';

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

export const HLS_TYPES = new Set([
  'application/x-mpegURL',
  'application/vnd.apple.mpegurl'
]);

/**
 * @typedef {typeof import('hls.js')} HlsConstructor
 */

/**
 * @typedef {import('hls.js')} Hls
 */

/**
 * @type {Map<string, HlsConstructor>}
 */
const HLS_LIB_CACHE = new Map();

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS) via the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library.
 *
 * You can decide whether you'd like to bundle `hls.js` into your application (not recommended), or
 * load it dynamically from your own server or a CDN. We recommended dynamically loading it to
 * prevent blocking the main thread when rendering this element, and to ensure `hls.js` is cached
 * separately.
 *
 * ## Dynamically Loaded
 *
 * ### CDN
 *
 * Simply point the `hlsLibrary` property or `hls-library` attribute to a script on a CDN
 * containing the library. For example, you could use the following URL
 * `https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js`. Swap `hls.js` for `hls.min.js` in
 * production.
 *
 * We recommended using either [JSDelivr](https://jsdelivr.com) or [UNPKG](https://unpkg.com).
 *
 * ```html
 * <vds-hls
 *   src="https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8"
 *   hls-library="https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js"
 * ></vds-hls>
 * ```
 *
 * ### Dynamic Import
 *
 * If you'd like to serve your own copy and control when the library is downloaded, simply
 * use [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)
 * and update the `hlsLibrary` property when ready. You must pass in the `hls.js` class constructor.
 *
 * ## Locally Bundled (not recommended)
 *
 * You'll need to install `hls.js`...
 *
 * ```bash
 * $: npm install hls.js@^0.14.0 @types/hls.js@^0.13.3
 * ```
 *
 * Finally, import it and pass it as a property to `<vds-hls>`...
 *
 * ```ts
 * import '@vidstack/elements/providers/hls/define.js';
 *
 * import { html, LitElement } from 'lit';
 * import Hls from 'hls.js';
 *
 * class MyElement extends LitElement {
 *   render() {
 *     return html`<vds-hls src="..."  .hlsLibrary=${Hls}></vds-hls>`;
 *   }
 * }
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
      HlsLoadEvent.TYPE,
      HlsLoadErrorEvent.TYPE,
      HlsAttachEvent.TYPE,
      HlsBuildEvent.TYPE,
      HlsDetachEvent.TYPE,
      HlsNoSupportEvent.TYPE
    ];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The `hls.js` configuration object.
   *
   * @type {Partial<Hls.Config> | undefined}
   */
  @property({ type: Object, attribute: 'hls-config' })
  hlsConfig;

  /**
   * The `hls.js` constructor or a URL of where it can be found. Only version `^0.13.3`
   * (note the `^`) is supported at the moment. Important to note that by default this is
   * `undefined` so you can freely optimize when the best possible time is to load the library.
   *
   * @type {HlsConstructor | string | undefined}
   */
  @property({ attribute: 'hls-library' })
  hlsLibrary;

  /**
   * @protected
   * @type {HlsConstructor | undefined}
   */
  _Hls;

  /**
   * The `hls.js` constructor.
   *
   * @type {HlsConstructor | undefined}
   */
  get Hls() {
    return this._Hls;
  }

  /**
   * @protected
   * @type {Hls | undefined}
   */
  _hlsEngine;

  /**
   * @protected
   * @type {boolean}
   */
  _isHlsEngineAttached = false;

  /**
   * The current `hls.js` instance.
   *
   * @type {Hls | undefined}
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
    this._initiateHlsLibraryDownloadConnection();
  }

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  async update(changedProperties) {
    super.update(changedProperties);

    if (this.hasUpdated && changedProperties.has('hlsLibrary')) {
      this._initiateHlsLibraryDownloadConnection();
      await this._buildHlsEngine(true);
      this._attachHlsEngine();
      this._loadSrcOnHlsEngine();
    }
  }

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    // TODO(mihar-22): Add a lazy load option to wait until in viewport.
    // Wait a frame to ensure the browser has had a chance to reach first-contentful-paint.
    window.requestAnimationFrame(() => {
      this._handleMediaSrcChange();
    });
  }

  disconnectedCallback() {
    this._destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * Attempts to preconnect to the `hls.js` remote source given via `hlsLibrary`. This is
   * assuming `hls.js` is not bundled and `hlsLibrary` is a URL string pointing to where it
   * can be found.
   *
   * @protected
   */
  _initiateHlsLibraryDownloadConnection() {
    if (!isString(this.hlsLibrary) || HLS_LIB_CACHE.has(this.hlsLibrary)) {
      return;
    }

    preconnect(this.hlsLibrary);
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
   * Whether HLS streaming is supported in this environment.
   *
   * @returns {boolean}
   */
  get isHlsSupported() {
    return (
      (this.Hls?.isSupported() ?? isNonNativeHlsStreamingPossible()) ||
      this.hasNativeHlsSupport
    );
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
   * after the provider has connected to the DOM (wait for `MediaProviderConnectEvent`).
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
    /**
     * // TODO: stage-2 we'll need to rework this line and determine when to "upgrade" to `hls.js`.
     *
     * @see https://github.com/vidstack/vds-elements/issues/376
     */
    if (isNonNativeHlsStreamingPossible()) return false;
    return this.hasNativeHlsSupport;
  }

  /**
   * Notifies the `VideoElement` whether the `src` attribute should be set on the rendered
   * `<video>` element. If we're using `hls.js` we don't want to override the `blob`.
   *
   * @protected
   * @returns {boolean}
   */
  _shouldSetVideoSrcAttr() {
    return this.shouldUseNativeHlsSupport || !this.isHlsStream;
  }

  /**
   * Loads `hls.js` from a remote source found at the `hlsLibrary` URL (if a string).
   *
   * @protected
   * @returns {Promise<void>}
   */
  async _loadHlsLibrary() {
    if (!isString(this.hlsLibrary) || HLS_LIB_CACHE.has(this.hlsLibrary)) {
      return;
    }

    const HlsConstructor = await this._loadHlsScript();

    // Loading failed.
    if (isUndefined(HlsConstructor)) return;

    HLS_LIB_CACHE.set(this.hlsLibrary, HlsConstructor);

    this.dispatchEvent(
      new HlsLoadEvent({
        detail: HlsConstructor
      })
    );
  }

  /**
   * Loads `hls.js` from the remote source given via `hlsLibrary` into the window namespace. This
   * is because `hls.js` in 2021 still doesn't provide a ESM export. This method will return
   * `undefined` if it fails to load the script. Listen to `HlsLoadErrorEvent` to be notified
   * of any failures.
   *
   * @protected
   * @returns {Promise<HlsConstructor | undefined>}
   */
  async _loadHlsScript() {
    if (!isString(this.hlsLibrary)) return undefined;

    try {
      await ScriptLoader.load(this.hlsLibrary);

      if (!isFunction(window.Hls)) {
        throw Error(
          '[vds]: Failed loading `hls.js`. Could not find a valid constructor at `window.Hls`.'
        );
      }

      return window.Hls;
    } catch (err) {
      this.dispatchEvent(
        new HlsLoadErrorEvent({
          detail: /** @type {Error} */ (err)
        })
      );
    }

    return undefined;
  }

  /**
   * @protected
   * @param {boolean} [forceRebuild=false]
   * @returns {Promise<void>}
   */
  async _buildHlsEngine(forceRebuild = false) {
    // Need to mount on `<video>`.
    if (
      isNil(this.videoEngine) &&
      !forceRebuild &&
      !isUndefined(this.hlsEngine)
    ) {
      return;
    }

    // Destroy old engine.
    if (!isUndefined(this.hlsEngine)) {
      this._destroyHlsEngine();
    }

    if (isString(this.hlsLibrary)) {
      await this._loadHlsLibrary();
    }

    // Either a remote source and we cached the `hls.js` constructor, or it was bundled directly.
    // The previous `loadHlsLibrary()` called would've populated the cache if it was remote.
    this._Hls = isString(this.hlsLibrary)
      ? HLS_LIB_CACHE.get(this.hlsLibrary)
      : this.hlsLibrary;

    if (!this.Hls?.isSupported()) {
      this.dispatchEvent(new HlsNoSupportEvent());
      return;
    }

    this._hlsEngine = new this.Hls(this.hlsConfig ?? {});
    this.dispatchEvent(new HlsBuildEvent({ detail: this.hlsEngine }));
    this._listenToHlsEngine();
  }

  /**
   * @protected
   */
  _destroyHlsEngine() {
    this.hlsEngine?.destroy();
    this._prevHlsEngineSrc = '';
    this._hlsEngine = undefined;
    this._isHlsEngineAttached = false;
    this._softResetMediaContext();
  }

  /** @type {string} */
  _prevHlsEngineSrc = '';

  /**
   * @protected
   * @returns {boolean}
   */
  // Let `Html5MediaElement` know we're taking over ready events.
  _willAnotherEngineAttach() {
    return this.isHlsStream && !this.shouldUseNativeHlsSupport;
  }

  /**
   * @protected
   */
  _attachHlsEngine() {
    if (
      this.isHlsEngineAttached ||
      isUndefined(this.hlsEngine) ||
      isNil(this.videoEngine)
    ) {
      return;
    }

    this.hlsEngine.attachMedia(this.videoEngine);
    this._isHlsEngineAttached = true;
    this.dispatchEvent(new HlsAttachEvent({ detail: this.hlsEngine }));
  }

  /**
   * @protected
   */
  _detachHlsEngine() {
    if (!this.isHlsEngineAttached) return;
    this.hlsEngine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsEngineSrc = '';
    this.dispatchEvent(new HlsDetachEvent({ detail: this.hlsEngine }));
  }

  /**
   * @protected
   */
  _loadSrcOnHlsEngine() {
    if (
      isNil(this.hlsEngine) ||
      !this.isHlsStream ||
      this.shouldUseNativeHlsSupport ||
      this.src === this._prevHlsEngineSrc
    ) {
      return;
    }

    this.hlsEngine.loadSource(this.src);
    this._prevHlsEngineSrc = this.src;
  }

  /**
   * @protected
   * @returns {MediaType}
   */
  _getMediaType() {
    if (this.ctx.isLiveVideo) {
      return MediaType.LiveVideo;
    }

    if (this.isHlsStream) {
      return MediaType.Video;
    }

    return super._getMediaType();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  /**
   * @param {Event} event
   */
  _handleLoadedMetadata(event) {
    super._handleLoadedMetadata(event);
    // iOS doesn't fire `canplay` event when loading HLS videos natively.
    if (this.shouldUseNativeHlsSupport && this.isHlsStream) {
      this._handleCanPlay(event);
    }
  }

  /**
   * @protected
   */
  async _handleMediaSrcChange() {
    super._handleMediaSrcChange();

    // We don't want to load `hls.js` until the browser has had a chance to paint.
    if (!this.hasUpdated) return;

    this.ctx.canPlay = false;

    if (!this.isHlsStream) {
      this._detachHlsEngine();
      return;
    }

    // Need to wait for `src` attribute on `<video>` to clear if last `src` was not using HLS engine.
    await this.updateComplete;

    if (isNil(this.hlsLibrary)) return;

    if (isUndefined(this.hlsEngine)) {
      await this._buildHlsEngine();
    }

    this._attachHlsEngine();
    this._loadSrcOnHlsEngine();
  }

  /**
   * @protected
   */
  _listenToHlsEngine() {
    if (isUndefined(this.hlsEngine) || isUndefined(this.Hls)) return;

    // TODO: Bind all events.

    this.hlsEngine.on(
      this.Hls.Events.LEVEL_LOADED,
      this._handleHlsLevelLoaded.bind(this)
    );

    this.hlsEngine.on(this.Hls.Events.ERROR, this._handleHlsError.bind(this));
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  _handleHlsError(eventType, data) {
    if (isUndefined(this.Hls)) return;

    this.ctx.error = data;

    if (data.fatal) {
      switch (data.type) {
        case this.Hls.ErrorTypes.NETWORK_ERROR:
          this._handleHlsNetworkError(eventType, data);
          break;
        case this.Hls.ErrorTypes.MEDIA_ERROR:
          this._handleHlsMediaError(eventType, data);
          break;
        default:
          this._handleHlsIrrecoverableError(eventType, data);
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
  _handleHlsNetworkError(eventType, data) {
    this.hlsEngine?.startLoad();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  _handleHlsMediaError(eventType, data) {
    this.hlsEngine?.recoverMediaError();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.errorData} data
   */
  _handleHlsIrrecoverableError(eventType, data) {
    this._destroyHlsEngine();
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.levelLoadedData} data
   */
  _handleHlsLevelLoaded(eventType, data) {
    if (this.ctx.canPlay) return;
    this._handleHlsMediaReady(eventType, data);
  }

  /**
   * @protected
   * @param {string} eventType
   * @param {Hls.levelLoadedData} data
   */
  _handleHlsMediaReady(eventType, data) {
    const { live, totalduration: duration } = data.details;

    const event = new VdsCustomEvent({ detail: data }, eventType);

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.ctx.mediaType !== mediaType) {
      this.ctx.mediaType = mediaType;
      this.dispatchEvent(
        new MediaTypeChangeEvent({ detail: mediaType, originalEvent: event })
      );
    }

    if (this.ctx.duration !== duration) {
      this.ctx.duration = duration;
      this.dispatchEvent(
        new DurationChangeEvent({ detail: duration, originalEvent: event })
      );
    }

    this._handleMediaReady(event);
  }
}
