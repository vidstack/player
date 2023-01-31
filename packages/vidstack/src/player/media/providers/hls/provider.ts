import type * as HLS from 'hls.js';
import { Dispose, effect, peek, signal } from 'maverick.js';
import { isString } from 'maverick.js/std';

import { preconnect } from '../../../../utils/network';
import { isHLSSupported } from '../../../../utils/support';
import type { MediaSrc } from '../../types';
import type { MediaProvider, MediaProviderContext } from '../types';
import { VideoProvider } from '../video/provider';
import { loadHLSLibrary } from './lib-loader';
import type { HLSConstructor, HLSInstanceCallback, HLSLibrary } from './types';
import { useHLS } from './use-hls';

export const HLS_PROVIDER = Symbol(__DEV__ ? 'HLS_PROVIDER' : 0);

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
 *   view="video"
 * >
 *   <media-outlet></media-outlet>
 * </media-player>
 * ```
 */
export class HLSProvider extends VideoProvider implements MediaProvider {
  [HLS_PROVIDER] = true;

  /**
   * Whether `hls.js` is supported in this environment.
   */
  static supported = isHLSSupported();

  override get type() {
    return 'hls';
  }

  protected _$ctor = signal<HLSConstructor | null>(null);
  protected _$instance = signal<HLS.default | null>(null);
  protected _$library = signal<HLSLibrary>(
    `${JS_DELIVR_CDN}/npm/hls.js@^1.0.0/dist/hls.light${__DEV__ ? '.js' : '.min.js'}`,
  );

  protected _instanceCallbacks = new Set<HLSInstanceCallback>();

  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  config: Partial<HLS.HlsConfig> = {};

  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js`
   */
  get library() {
    return this._$library();
  }

  set library(library) {
    this._$library.set(library);
  }

  preconnect(): void {
    const lib = this._$library();
    if (!isString(lib)) return;
    preconnect(lib);
  }

  override setup(context: MediaProviderContext) {
    super.setup(context);

    // Load HLS library
    effect(() => {
      const library = this._$library();
      loadHLSLibrary(library, context).then((ctor) => {
        if (this._$library() !== library) return;
        this._$ctor.set(() => ctor);
      });
    });

    useHLS(this, this.config, this._$ctor, this._$instance, context, this._instanceCallbacks);
  }

  /**
   * The `hls.js` constructor.
   */
  get ctor() {
    return this._$ctor();
  }

  /**
   * The current `hls.js` instance.
   */
  get instance() {
    return this._$instance();
  }

  override async loadSource(src: MediaSrc) {
    effect(() => {
      const instance = this._$instance();
      instance?.loadSource(src.src);
    });
  }

  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback: HLSInstanceCallback): Dispose {
    const instance = peek(this._$instance);
    if (instance) callback(instance);
    this._instanceCallbacks.add(callback);
    return () => this._instanceCallbacks.delete(callback);
  }
}
