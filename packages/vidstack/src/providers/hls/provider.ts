import { peek, type Dispose } from 'maverick.js';
import { isString } from 'maverick.js/std';

import type { Src } from '../../core/api/src-types';
import { preconnect } from '../../utils/network';
import { isHLSSupported } from '../../utils/support';
import type { MediaProviderAdapter } from '../types';
import { VideoProvider } from '../video/provider';
import { HLSController } from './hls';
import { HLSLibLoader } from './lib-loader';
import type { HLSConstructor, HLSInstanceCallback, HLSLibrary } from './types';

const JS_DELIVR_CDN = 'https://cdn.jsdelivr.net';

/**
 * The HLS provider introduces support for HLS streaming via the popular `hls.js`
 * library. HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/hls}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md}
 * @example
 * ```html
 * <media-player
 *   src="https://media-files.vidstack.io/hls/index.m3u8"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class HLSProvider extends VideoProvider implements MediaProviderAdapter {
  protected override $$PROVIDER_TYPE = 'HLS';

  private _ctor: HLSConstructor | null = null;
  private readonly _controller = new HLSController(this.video, this._ctx);

  /**
   * The `hls.js` constructor.
   */
  get ctor() {
    return this._ctor;
  }

  /**
   * The current `hls.js` instance.
   */
  get instance() {
    return this._controller.instance;
  }

  /**
   * Whether `hls.js` is supported in this environment.
   */
  static supported = isHLSSupported();

  override get type() {
    return 'hls';
  }

  get canLiveSync() {
    return true;
  }

  protected _library: HLSLibrary = `${JS_DELIVR_CDN}/npm/hls.js@^1.5.0/dist/hls${
    __DEV__ ? '.js' : '.min.js'
  }`;

  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  get config() {
    return this._controller._config;
  }

  set config(config) {
    this._controller._config = config;
  }

  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
   */
  get library() {
    return this._library;
  }

  set library(library) {
    this._library = library;
  }

  preconnect(): void {
    if (!isString(this._library)) return;
    preconnect(this._library);
  }

  override setup() {
    super.setup();
    new HLSLibLoader(this._library, this._ctx, (ctor) => {
      this._ctor = ctor;
      this._controller.setup(ctor);
      this._ctx.delegate._notify('provider-setup', this);
      const src = peek(this._ctx.$state.source);
      if (src) this.loadSource(src);
    });
  }

  override async loadSource(src: Src, preload?: HTMLMediaElement['preload']) {
    if (!isString(src.src)) {
      this._removeSource();
      return;
    }

    this._media.preload = preload || '';
    this._appendSource(src as Src<string>, 'application/x-mpegurl');
    this._controller._loadSource(src);
    this._currentSrc = src as Src<string>;
  }

  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback: HLSInstanceCallback): Dispose {
    const instance = this._controller.instance;
    if (instance) callback(instance);
    this._controller._callbacks.add(callback);
    return () => this._controller._callbacks.delete(callback);
  }

  destroy() {
    this._controller._destroy();
  }
}
