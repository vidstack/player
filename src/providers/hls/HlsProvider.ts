import { Disposal } from '@wcom/events';
import type Hls from 'hls.js';
import { property, PropertyValues } from 'lit-element';

import { EngineBuildEvent, EngineNoSupportEvent, MediaType } from '../../core';
import { LibLoader } from '../../shared/LibLoader';
import { isNil, isUndefined } from '../../utils/unit';
import { VideoProvider } from '../video';
import { HlsProviderEngine } from './hls.types';
import { HLS_EXTENSIONS, HLS_TYPES } from './hls.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS) via the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library.
 *
 * @tagname vds-hls
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui: Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * @csspart container: The container element that wraps the video.
 * @csspart video: The video element.
 *
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-hls>
 * ```
 *
 * @example
 * ```html
 *  <vds-hls poster="/media/poster.png">
 *    <source src="/media/index.m3u8" type="application/x-mpegURL" />
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-hls>
 * ```
 */
export class HlsProvider extends VideoProvider<HlsProviderEngine> {
  protected _engine?: HlsProviderEngine;

  protected HlsLib?: typeof Hls;

  protected libLoader: LibLoader<typeof Hls>;

  protected _hasEngineAttached = false;

  protected engineDisposal = new Disposal();

  constructor() {
    super();
    this.libLoader = new LibLoader(this.libSrc, 'Hls');
  }

  connectedCallback(): void {
    this.buildAndAttachEngine();
  }

  async firstUpdated(changedProps: PropertyValues): Promise<void> {
    super.firstUpdated(changedProps);
    this.buildAndAttachEngine();
  }

  disconnectedCallback(): void {
    this.engineDisposal.empty();
    this._engine?.destroy();
    this._hasEngineAttached = false;
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The URL where the `hls.js` library source can be found.
   */
  @property()
  libSrc = 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.min.js';

  get engine(): HlsProviderEngine {
    return this._engine;
  }

  /**
   * Whether the current engine has mounted the underlying HTML5 media element.
   */
  get hasEngineAttached(): boolean {
    return this.hasEngineAttached;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): boolean {
    return HLS_TYPES.has(type) || super.canPlayType(type);
  }

  protected async buildAndAttachEngine(): Promise<void> {
    if (isNil(this.mediaEl)) return;

    if (!isUndefined(this.engine)) {
      this.attachEngine();
      return;
    }

    this.libLoader.src = this.libSrc;
    this.HlsLib = await this.libLoader.download();

    if (!this.HlsLib.isSupported()) {
      this.dispatchEvent(new EngineNoSupportEvent());
      return;
    }

    // TODO: pass in configuration
    this._engine = new this.HlsLib();
    this.dispatchEvent(new EngineBuildEvent({ detail: this.engine }));
    this.attachEngine();
  }

  protected attachEngine(): void {
    if (!isUndefined(this.engine) || isNil(this.mediaEl)) return;
    // ...
  }

  protected listenToEngine(): void {
    this.engineDisposal.empty();

    // this.hls!.on(Hls.Events.MEDIA_ATTACHED, () => {
    //   this._hasAttached = true;
    //   this.onSrcChange();
    // this.dispatchEvent(new EngineAttachEvent({ detail: this.engine }));
    // });
    // this.hls!.on(Hls.Events.ERROR, (event: any, data: any) => {
    //   if (data.fatal) {
    //     switch (data.type) {
    //       case Hls.ErrorTypes.NETWORK_ERROR:
    //         this.hls.startLoad();
    //         break;
    //       case Hls.ErrorTypes.MEDIA_ERROR:
    //         this.hls.recoverMediaError();
    //         break;
    //       default:
    //         this.destroyHls();
    //         break;
    //     }
    //   }
    //   this.vmError.emit({ event, data });
    // });
    // this.hls!.on(Hls.Events.MANIFEST_PARSED, () => {
    //   this.dispatch('currentSrc', this.src);
    // });
    // this.hls?.attachMedia(this.mediaEl);
  }

  protected getMediaType(): MediaType {
    if (HLS_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Video;
    }

    return super.getMediaType();
  }
}
