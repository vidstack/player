import { Component, effect, peek, State } from 'maverick.js';
import { animationFrameThrottle, isNull, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { findActiveCue } from '../../../core/tracks/text/utils';
import { $ariaBool } from '../../../utils/aria';
import { ThumbnailsLoader } from './thumbnail-loader';

export interface ThumbnailState {
  src: string;
  img: HTMLImageElement | null | undefined;
  coords: ThumbnailCoords | null;
  activeCue: VTTCue | null;
  loading: boolean;
  error: ErrorEvent | null;
  hidden: boolean;
}

/**
 * Used to load and display a preview thumbnail at the given `time`.
 *
 * @attr data-loading - Whether thumbnail image is loading.
 * @attr data-error - Whether an error occurred loading thumbnail.
 * @attr data-hidden - Whether thumbnail is not available or failed to load.
 * @docs {@link https://www.vidstack.io/docs/player/components/display/thumbnail}
 */
export class Thumbnail extends Component<ThumbnailProps, ThumbnailState> {
  static props: ThumbnailProps = {
    src: '',
    time: 0,
  };

  static state = new State<ThumbnailState>({
    src: '',
    img: null,
    coords: null,
    activeCue: null,
    loading: false,
    error: null,
    hidden: false,
  });

  protected _media!: MediaContext;
  protected _thumbnails!: ThumbnailsLoader;

  private _styleResets: (() => void)[] = [];

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._thumbnails = ThumbnailsLoader.create(this.$props.src);

    this.setAttributes({
      'data-loading': this._isLoading.bind(this),
      'data-error': this._hasError.bind(this),
      'data-hidden': this.$state.hidden,
      'aria-hidden': $ariaBool(this.$state.hidden),
    });
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchImg.bind(this));
    effect(this._watchHidden.bind(this));
    effect(this._onLoadStart.bind(this));
    effect(this._onFindActiveCue.bind(this));
    effect(this._onResolveThumbnail.bind(this));
  }

  private _watchImg() {
    const img = this.$state.img();
    if (!img) return;
    listenEvent(img, 'load', this._onLoaded.bind(this));
    listenEvent(img, 'error', this._onError.bind(this));
  }

  private _onLoadStart() {
    const { src, loading, error } = this.$state;
    src();
    loading.set(true);
    error.set(null);
  }

  private _onLoaded() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
    this._requestResize();
  }

  private _onError(event: ErrorEvent) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }

  private _isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }

  private _hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }

  private _watchHidden() {
    const { hidden } = this.$state,
      { duration } = this._media.$state,
      cues = this._thumbnails.$cues();
    hidden.set(this._hasError() || !Number.isFinite(duration()) || cues.length === 0);
  }

  protected _getTime() {
    return this.$props.time();
  }

  private _onFindActiveCue() {
    const time = this._getTime(),
      { activeCue } = this.$state,
      { duration } = this._media.$state,
      cues = this._thumbnails.$cues();

    if (!cues || !Number.isFinite(duration())) {
      activeCue.set(null);
      return;
    }

    activeCue.set(findActiveCue(cues, time));
  }

  private _onResolveThumbnail() {
    let { activeCue } = this.$state,
      cue = activeCue(),
      baseURL = peek(this.$props.src);

    if (!/^https?:/.test(baseURL)) {
      baseURL = location.href;
    }

    if (!baseURL || !cue) {
      this.$state.src.set('');
      this._resetStyles();
      return;
    }

    const [src, coords = ''] = (cue.text || '').split('#');
    this.$state.coords.set(this._resolveThumbnailCoords(coords));

    this.$state.src.set(this._resolveThumbnailSrc(src, baseURL));
    this._requestResize();
  }

  private _resolveThumbnailSrc(src: string, baseURL: string) {
    return /^https?:/.test(src) ? src : new URL(src, baseURL).href;
  }

  private _resolveThumbnailCoords(coords: string) {
    const [props, values] = coords.split('='),
      resolvedCoords = {},
      coordValues = values?.split(',');

    if (!props || !values) return null;

    for (let i = 0; i < props.length; i++) resolvedCoords[props[i]] = +coordValues[i];

    return resolvedCoords as ThumbnailCoords;
  }

  private _requestResize = animationFrameThrottle(this._resize.bind(this));

  private _resize() {
    if (!this.scope) return;

    const img = this.$state.img(),
      coords = this.$state.coords();

    if (!img || !this.el) return;

    const w = coords?.w ?? img.naturalWidth,
      h = coords?.h ?? img.naturalHeight,
      { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(this.el),
      minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h),
      maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h),
      scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;

    this._style(this.el!, '--thumbnail-width', `${w * scale}px`);
    this._style(this.el!, '--thumbnail-height', `${h * scale}px`);
    this._style(img, 'width', `${img.naturalWidth * scale}px`);
    this._style(img, 'height', `${img.naturalHeight * scale}px`);
    this._style(
      img,
      'transform',
      coords ? `translate(-${coords.x * scale}px, -${coords.y * scale}px)` : '',
    );
    this._style(img, 'max-width', 'none');
  }

  private _style(el: HTMLElement, name: string, value: string) {
    el.style.setProperty(name, value);
    this._styleResets.push(() => el.style.removeProperty(name));
  }

  private _resetStyles() {
    for (const reset of this._styleResets) reset();
    this._styleResets = [];
  }
}

export interface ThumbnailProps {
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  src: string;
  /**
   * Finds, loads, and displays the first active thumbnail cue that's start/end times are in range.
   */
  time: number;
}

export interface ThumbnailCoords {
  w: number;
  h: number;
  x: number;
  y: number;
}
