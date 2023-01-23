import type * as HLS from 'hls.js';
import type { WriteSignal } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  VideoProviderCSSVars,
  VideoProviderMembers,
  VideoProviderProps,
} from '../video/types';
import type { HLSProviderEvents } from './events';

export { HLSProviderEvents };

export type HLSConstructor = typeof HLS.default;
export type HLSConstructorLoader = () => Promise<{ default: HLSConstructor } | undefined>;
export type HLSLibrary = HLSConstructor | HLSConstructorLoader | string | undefined;

export interface HLSProviderProps extends VideoProviderProps {
  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  config: Partial<HLS.HlsConfig>;
  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.js`
   */
  library: HLSLibrary;
}

export interface HLSProviderMembers extends VideoProviderMembers {
  /* @internal */
  $$_add_listeners?: WriteSignal<[type: string, once?: boolean][]>;
  /* @internal */
  $$_remove_listeners?: WriteSignal<string[]>;
  /**
   * Contains the HLS constructor, engine (i.e., `hls.js` instance), and additional information
   * on whether HLS is supported in this environment or the current engine is attached to the
   * underlying HTML media element.
   */
  readonly hls: {
    /**
     * The `hls.js` constructor.
     */
    readonly ctor: HLSConstructor | null;
    /**
     * The current `hls.js` instance.
     *
     * @signal
     */
    readonly engine: HLS.default | null;
    /**
     * Whether HLS streaming is supported in this environment.
     */
    readonly supported: boolean;
    /**
     * Whether the `hls.js` instance has mounted the `HTMLMediaElement`.
     *
     * @signal
     * @defaultValue false
     */
    readonly attached: boolean;
  };
}

export interface HLSProviderCSSVars extends VideoProviderCSSVars {}

/**
 * The `<vds-hls-video>` component introduces support for HLS streaming via the popular `hls.js`
 * library. HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * Do note, `hls.js` is only loaded when needed and supported.
 *
 * 💡 This element can attach `hls.js` events so you can listen to them through the native DOM
 * interface (i.e., el.addEventListener(`hls-media-attaching`)).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/providers/hls-video}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md}
 * @slot - Used to pass in the `<video>` element.
 * @example
 * ```html
 * <vds-media poster="https://media-files.vidstack.io/poster.png">
 *   <vds-hls-video>
 *     <video
 *       preload="none"
 *       src="https://media-files.vidstack.io/hls/index.m3u8"
 *     ></video>
 *   </vds-hls-video>
 * </vds-media>
 * ```
 * @example
 * ```html
 * <vds-media poster="https://media-files.vidstack.io/poster.png">
 *   <vds-hls-video>
 *     <video preload="none">
 *       <source
 *         src="https://media-files.vidstack.io/hls/index.m3u8"
 *         type="application/x-mpegURL"
 *       />
 *       <track
 *         default
 *         kind="subtitles"
 *         srclang="en"
 *         label="English"
 *         src="https://media-files.vidstack.io/subs/english.vtt"
 *       />
 *     </video>
 *   </vds-hls-video>
 * </vds-media>
 * ```
 */
export interface HLSVideoElement
  extends HTMLCustomElement<HLSProviderProps, HLSProviderEvents, HLSProviderCSSVars>,
    HLSProviderMembers {}
