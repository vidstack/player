import { peek, type Dispose } from 'maverick.js';
import { isString } from 'maverick.js/std';

import type { Src } from '../../core/api/src-types';
import { preconnect } from '../../utils/network';
import { isDASHSupported } from '../../utils/support';
import type { MediaProviderAdapter } from '../types';
import { VideoProvider } from '../video/provider';
import { DASHController } from './dash';
import { DASHLibLoader } from './lib-loader';
import type { DASHConstructor, DASHInstanceCallback, DASHLibrary } from './types';

const JS_DELIVR_CDN = 'https://cdn.jsdelivr.net';

/**
 * The DASH provider introduces support for DASH streaming via the popular `dash.js`
 *
 * @docs {@link https://www.vidstack.io/docs/player/providers/dash}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://cdn.dashjs.org/latest/jsdoc/index.html}
 * @example
 * ```html
 * <media-player
 *   src="https://files.vidstack.io/dash/manifest.mpd"
 *   poster="https://files.vidstack.io/poster.png"
 * >
 *   <media-provider></media-provider>
 * </media-player>
 * ```
 */
export class DASHProvider extends VideoProvider implements MediaProviderAdapter {
  protected override $$PROVIDER_TYPE = 'DASH';

  #ctor: DASHConstructor | null = null;
  readonly #controller = new DASHController(this.video, this.ctx);

  /**
   * The `dash.js` constructor.
   */
  get ctor() {
    return this.#ctor;
  }

  /**
   * The current `dash.js` instance.
   */
  get instance() {
    return this.#controller.instance;
  }

  /**
   * Whether `dash.js` is supported in this environment.
   */
  static supported = isDASHSupported();

  override get type() {
    return 'dash';
  }

  get canLiveSync() {
    return true;
  }

  #library: DASHLibrary = `${JS_DELIVR_CDN}/npm/dashjs@4.7.4/dist/dash${
    __DEV__ ? '.all.debug.js' : '.all.min.js'
  }`;

  /**
   * The `dash.js` configuration object.
   *
   * @see {@link https://cdn.dashjs.org/latest/jsdoc/module-Settings.html}
   */
  get config() {
    return this.#controller.config;
  }

  set config(config) {
    this.#controller.config = config;
  }

  /**
   * The `dash.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js`
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
    new DASHLibLoader(this.#library, this.ctx, (ctor) => {
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
   * The given callback is invoked when a new `dash.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback: DASHInstanceCallback): Dispose {
    const instance = this.#controller.instance;
    if (instance) callback(instance);
    return this.#controller.onInstance(callback);
  }

  destroy() {
    this.#controller.destroy();
  }
}
