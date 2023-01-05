import type * as HLS from 'hls.js';
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
  hlsConfig: Partial<HLS.HlsConfig>;
  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.js`
   */
  hlsLibrary: HLSLibrary;
}

export interface HLSProviderMembers extends VideoProviderMembers {
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

  // see https://github.com/vidstack/player/issues/583
  'hls-config': HLS.HlsConfig;
  'hls-library': HLSLibrary;
}

export interface HLSProviderCSSVars extends VideoProviderCSSVars {}

/**
 * The `<vds-hls-video>` element adapts the underlying `<video>` element to satisfy the media
 * provider interface, which generally involves providing a consistent API for loading, managing,
 * and tracking media state.
 *
 * This element also introduces support for HLS streaming via the popular `hls.js` library.
 * HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * Do note, `hls.js` is only loaded when needed and supported.
 *
 * 💡 This element can attach `hls.js` events so you can listen to them through the native DOM
 * interface (i.e., .addEventListener(`hls-media-attaching`)).
 *
 * @slot - Used to pass in the `<video>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md}
 * @example
 * ```html
 * <vds-hls-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/hls/index.m3u8"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   ></video>
 * </vds-hls-video>
 * ```
 * @example
 * ```html
 * <vds-hls-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   >
 *     <source
 *       src="https://media-files.vidstack.io/hls/index.m3u8"
 *       type="application/x-mpegURL"
 *     />
 *     <track
 *       default
 *       kind="subtitles"
 *       srclang="en"
 *       label="English"
 *       src="https://media-files.vidstack.io/subs/english.vtt"
 *     />
 *   </video>
 * </vds-hls-video>
 * ```
 */
export interface HLSVideoElement
  extends HTMLCustomElement<HLSProviderProps, HLSProviderEvents, HLSProviderCSSVars>,
    HLSProviderMembers {}
