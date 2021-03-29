import type Hls from 'hls.js';

import { Callback } from '../../shared/types';
import {
  VideoProviderActions,
  VideoProviderEngine,
  VideoProviderProps,
} from '../video';

export interface HlsProviderProps extends VideoProviderProps {
  /**
   * The URL where the `hls.js` library source can be found.
   */
  libSrc: string;

  /**
   * The `hls.js` configuration object.
   */
  hlsConfig?: Partial<Hls.Config>;

  /**
   * Whether the browser natively supports HLS, mostly only true in Safari. Only call this method
   * after the provider has connected to the DOM (wait for `ConnectEvent`).
   */
  readonly hasNativeHlsSupport: boolean;

  /**
   * Whether the current src is using HLS.
   */
  readonly isCurrentlyHls: boolean;

  /**
   * Whether the `hls.js` instance has mounted the `HtmlMediaElement`.
   */
  readonly isHlsEngineAttached: boolean;

  /**
   * Whether native HLS support is available and whether it should be used. Generally defaults
   * to `false` as long as `window.MediaSource` is defined to enforce consistency by
   * using `hls.js` where ever possible.
   */
  readonly shouldUseNativeHlsSupport: boolean;

  /**
   * The underlying `HTMLMediaElement`.
   */
  readonly videoEngine: VideoProviderEngine;
}

export interface HlsProviderActions extends VideoProviderActions {
  onEngineBuilt: Callback<CustomEvent>;
  onEngineAttach: Callback<CustomEvent>;
  onEngineDetach: Callback<CustomEvent>;
  onEngineNoSupport: Callback<CustomEvent>;
}

export type HlsProviderEngine = Hls | undefined;
