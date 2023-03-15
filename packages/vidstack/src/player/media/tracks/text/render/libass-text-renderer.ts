import { DOMEvent, isString } from 'maverick.js/std';

import { TEXT_TRACK_READY_STATE } from '../symbols';
import type { TextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class LibASSTextRenderer implements TextRenderer {
  readonly priority = 1;

  private _instance: LibASSInstance | null = null;
  private _track: TextTrack | null = null;
  private _typeRE = /(ssa|ass)$/;

  constructor(public readonly loader: LibASSModuleLoader, public config?: LibASSConfig) {}

  canRender(track: TextTrack): boolean {
    return (
      !!track.src &&
      ((isString(track.type) && this._typeRE.test(track.type)) || this._typeRE.test(track.src))
    );
  }

  attach(video: HTMLVideoElement) {
    this.loader().then(async (mod) => {
      this._instance = new mod.default({
        ...this.config,
        video,
        subUrl: this._track?.src || '',
        onReady: () => {
          const canvas = video.parentElement!.querySelector(
            '.libassjs-canvas-parent',
          ) as HTMLCanvasElement | null;
          if (canvas) canvas.style.pointerEvents = 'none';
          this.config?.onReady?.();
        },
        onError: (error) => {
          if (this._track) {
            this._track[TEXT_TRACK_READY_STATE] = 3;
            this._track.dispatchEvent(new DOMEvent('error', { detail: error }));
          }
          this.config?.onError?.(error);
        },
      });
    });
  }

  changeTrack(track: TextTrack | null) {
    if (!track || track.readyState === 3) {
      this._freeTrack();
    } else if (this._track !== track) {
      this._instance?.setTrackByUrl(track.src!);
      this._track = track;
    }
  }

  detach(): void {
    this._freeTrack();
  }

  private _freeTrack() {
    this._instance?.freeTrack();
    this._track = null;
  }
}

export interface LibASSModuleLoader {
  (): Promise<{
    default: LibASSConstructor;
  }>;
}

export interface LibASSConstructor {
  new (
    config?: {
      canvas?: HTMLCanvasElement;
      subUrl?: string;
      video: HTMLVideoElement;
    } & LibASSConfig,
  ): LibASSInstance;
}

export interface LibASSInstance {
  setTrackByUrl(url: string): void;
  setCurrentTime(time: number): void;
  freeTrack(): void;
  dispose(): void;
}

/**
 * @see {@link https://github.com/libass/JavascriptSubtitlesOctopus#options}
 */
export interface LibASSConfig {
  /**
   * Whether performance info is printed in the console.
   *
   * @defaultValue false
   */
  debug?: boolean;
  /**
   * An array of links to the fonts used in the subtitle.
   *
   * @defaultValue []
   */
  fonts?: string[];
  /**
   * The URL of the worker.
   */
  workerUrl?: string;
  /**
   * Link to non-WebAssembly worker.
   */
  legacyWorkerUrl?: string;
  /**
   * Object with all available fonts - key is font name in lower case, value is link.
   *
   * @defaultValue {}
   * @example
   * ```ts
   * { "arial": "/font1.tff" }
   * ```
   */
  availableFonts?: Record<string, string>;
  /**
   * URL to override fallback font, for example, with a CJK one.
   *
   * @defaultValue Liberation Sans
   */
  fallbackFont?: string;
  /**
   * A boolean, whether to load files in a lazy way via [`FS.createLazyFile()`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.createLazyFile).
   * Requires Access-Control-Expose-Headers for Accept-Ranges, Content-Length, and Content-Encoding.
   * If encoding is compressed or length is not set, file will be fully fetched instead of just a
   * HEAD request.
   */
  lazyFileLoading?: boolean;
  /**
   * Rendering mode.
   *
   * @defaultValue lossyRender
   * @see {@link https://github.com/libass/JavascriptSubtitlesOctopus#rendering-modes}
   */
  renderMode?: 'js-blend' | 'wasm-blend' | 'lossy';
  /**
   * Target frames per second.
   *
   * @defaultValue 24
   */
  targetFps?: number;
  /**
   * libass bitmap cache memory limit in MiB (approximate).
   *
   * @defaultValue 0 - no limit
   */
  libassMemoryLimit?: number;
  /**
   * libass glyph cache memory limit in MiB (approximate)
   *
   * @defaultValue 0 - no limit
   */
  libassGlyphLimit?: number;
  /**
   * Scale down (< 1.0) the subtitles canvas to improve performance at the expense of quality,
   * or scale it up (> 1.0).
   *
   * @defaultValue 1.0 - no scaling; must be a number > 0
   */
  prescaleFactor?: number;
  /**
   * The height beyond which the subtitles canvas won't be pre-scaled.
   *
   * @defaultValue 1080
   */
  prescaleHeightLimit?: number;
  /**
   * The maximum rendering height of the subtitles canvas. Beyond this subtitles will be up-scaled
   * by the browser.
   *
   * @defaultValue 0 - no limit
   */
  maxRenderHeight?: number;
  /**
   * If set to true, attempt to discard all animated tags. Enabling this may severely mangle
   * complex subtitles and should only be considered as an last ditch effort of uncertain success
   * for hardware otherwise incapable of displaying anything. Will not reliably work with
   * manually edited or allocated events.
   *
   * @defaultValue false - do nothing
   */
  dropAllAnimations?: boolean;
  /**
   * Function that's called when SubtitlesOctopus is ready.
   */
  onReady?(): void;
  /**
   * Function called in case of critical error meaning the subtitles wouldn't be shown and you
   * should use an alternative method (for instance it occurs if browser doesn't support web
   * workers).
   */
  onError?(error: Error): void;
}
