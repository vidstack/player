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
 *   src="https://files.vidstack.io/hls/index.m3u8"
 *   poster="https://files.vidstack.io/poster.png"
 * >
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class HLSProvider extends VideoProvider implements MediaProviderAdapter {
  protected override $$PROVIDER_TYPE = 'HLS';

  #ctor: HLSConstructor | null = null;
  readonly #controller = new HLSController(this.video, this.ctx);

  /**
   * The `hls.js` constructor.
   */
  get ctor() {
    return this.#ctor;
  }

  /**
   * The current `hls.js` instance.
   */
  get instance() {
    return this.#controller.instance;
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

  #library: HLSLibrary = `${JS_DELIVR_CDN}/npm/hls.js@^1.5.0/dist/hls${
    __DEV__ ? '.js' : '.min.js'
  }`;

  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  get config() {
    return this.#controller.config;
  }

  set config(config) {
    this.#controller.config = config;
  }

  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
   */
  get library() {
    return this.#library;
  }

  set library(library) {
    this.#library = library;
  }

  preconnect(): void {
    if (!isString(this.#library)) return;
    preconnect(this.#library);
  }

  override setup() {
    super.setup();
    new HLSLibLoader(this.#library, this.ctx, (ctor) => {
      this.#ctor = ctor;
      this.#controller.setup(ctor);
      this.ctx.notify('provider-setup', this);
      const src = peek(this.ctx.$state.source);
      if (src) this.loadSource(src);
    });
  }

  override async loadSource(src: Src, preload?: HTMLMediaElement['preload']) {
    if (!isString(src.src)) {
      this.removeSource();
      return;
    }

    this.media.preload = preload || '';
    this.appendSource(src as Src<string>, 'application/x-mpegurl');
    this.#controller.loadSource(src);
    this.currentSrc = src as Src<string>;
  }

  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback: HLSInstanceCallback): Dispose {
    const instance = this.#controller.instance;
    if (instance) callback(instance);
    return this.#controller.onInstance(callback);
  }

  destroy() {
    this.#controller.destroy();
  }
}
