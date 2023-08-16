import { DOMEvent, EventsTarget, isString, listenEvent } from 'maverick.js/std';
import { TextTrackSymbol } from '../symbols';
import type { TextTrack } from '../text-track';
import type { TextRenderer } from './text-renderer';

export class LibASSTextRenderer implements TextRenderer {
  readonly priority = 1;

  private _instance: LibASSInstance | null = null;
  private _track: TextTrack | null = null;
  private _typeRE = /(ssa|ass)$/;

  constructor(
    public readonly loader: LibASSModuleLoader,
    public config?: LibASSConfig,
  ) {}

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
      });

      listenEvent(this._instance, 'ready', () => {
        const canvas = this._instance?._canvas;
        if (canvas) canvas.style.pointerEvents = 'none';
      });

      listenEvent(this._instance, 'error', (event) => {
        if (this._track) {
          this._track[TextTrackSymbol._readyState] = 3;
          this._track.dispatchEvent(
            new DOMEvent('error', {
              trigger: event,
              detail: event.error,
            }),
          );
        }
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
      video: HTMLVideoElement;
      canvas?: HTMLCanvasElement;
      subUrl?: string;
    } & LibASSConfig,
  ): LibASSInstance;
}

export interface LibASSInstance extends EventsTarget<LibASSInstanceEvents> {
  _video: HTMLVideoElement;
  _canvas: HTMLVideoElement | null;
  setTrackByUrl(url: string): void;
  setCurrentTime(time: number): void;
  freeTrack(): void;
  destroy(): void;
}

export interface LibASSInstanceEvents {
  ready: LibASSReadyEvent;
  error: LibASSErrorEvent;
}

export interface LibASSReadyEvent extends Event {}

export interface LibASSErrorEvent extends ErrorEvent {}

/**
 * @see {@link https://github.com/ThaUnknown/jassub/tree/main#options}
 */
export interface LibASSConfig {
  /**
   * Which image blending mode to use. WASM will perform better on lower end devices, JS will
   * perform better if the device and browser supports hardware acceleration.
   *
   * @defaultValue "js"
   */
  blendMode?: 'js' | 'wasm';
  /**
   * Whether or not to use async rendering, which offloads the CPU by creating image bitmaps on
   * the GPU.
   *
   * @defaultValue true
   */
  asyncRender?: boolean;
  /**
   * Whether or not to render things fully on the worker, greatly reduces CPU usage.
   *
   * @defaultValue true
   */
  offscreenRender?: boolean;
  /**
   * Whether or not to render subtitles as the video player renders frames, rather than predicting
   * which frame the player is on using events.
   *
   * @defaultValue true
   */
  onDemandRender?: boolean;
  /**
   * Target FPS to render subtitles at. Ignored when onDemandRender is enabled.
   *
   * @defaultValue 24
   */
  targetFps?: number;
  /**
   * Subtitle time offset in seconds.
   *
   * @defaultValue 0
   */
  timeOffset?: number;
  /**
   * Whether or not to print debug information.
   *
   * @defaultValue false
   */
  debug?: boolean;
  /**
   * Scale down (< 1.0) the subtitles canvas to improve performance at the expense of quality, or
   * scale it up (> 1.0).
   *
   * @defaultValue 1.0
   */
  prescaleFactor?: number;
  /**
   * The height in pixels beyond which the subtitles canvas won't be pre-scaled.
   *
   * @defaultValue 1080
   */
  prescaleHeightLimit?: number;
  /**
   * The maximum rendering height in pixels of the subtitles canvas. Beyond this subtitles will
   * be up-scaled by the browser.
   *
   * @defaultValue 0
   */
  maxRenderHeight?: number;
  /**
   * Attempt to discard all animated tags. Enabling this may severely mangle complex subtitles
   * and should only be considered as an last ditch effort of uncertain success for hardware
   * otherwise incapable of displaying anything. Will not reliably work with manually edited or
   * allocated events.
   *
   * @defaultValue false
   */
  dropAllAnimations?: boolean;
  /**
   * The URL of the worker.
   *
   * @defaultValue "jassub-worker.js"
   */
  workerUrl?: string;
  /**
   * The URL of the legacy worker. Only loaded if the browser doesn't support WASM.
   *
   * @defaultValue "jassub-worker-legacy.js"
   */
  legacyWorkerUrl?: string;
  /**
   * The URL of the subtitle file to play.
   *
   */
  subUrl?: string;
  /**
   * The content of the subtitle file to play.
   *
   */
  subContent?: string;
  /**
   * An array of links or `Uint8Array` to the fonts used in the subtitle. If `Uint8Array` is used
   * the array is copied, not referenced. This forces all the fonts in this array to be loaded
   * by the renderer, regardless of if they are used.
   *
   */
  fonts?: string[] | Uint8Array[];
  /**
   * Object with all available fonts. Key is font family in lower case, value is link or
   * `Uint8Array`. These fonts are selectively loaded if detected as used in the current
   * subtitle track.
   *
   * @defaultValue {'liberation sans': './default.woff2'}}
   */
  availableFonts?: Record<string, string>;
  /**
   * The font family key of the fallback font in `availableFonts` to use if the other font
   * for the style is missing special glyphs or unicode.
   *
   * @defaultValue "liberation sans"
   */
  fallbackFont?: string;
  /**
   * If the Local Font Access API is enabled `[chrome://flags/#font-access]`, the library will
   * query for permissions to use local fonts and use them if any are missing. The permission can
   * be queried beforehand using `navigator.permissions.request({ name: 'local-fonts' })`.
   *
   * @defaultValue true
   */
  useLocalFonts?: boolean;
  /**
   * libass bitmap cache memory limit in MiB (approximate).
   */
  libassMemoryLimit?: number;
  /**
   * libass glyph cache memory limit in MiB (approximate).
   */
  libassGlyphLimit?: number;
}
