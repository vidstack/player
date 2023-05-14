import { effect, peek, signal } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import type { VTTCue } from 'media-captions';

import { $ariaBool } from '../../utils/aria';
import { useMedia, type MediaContext } from '../core/api/context';
import { findActiveCue } from '../core/tracks/text/utils';

declare global {
  interface MaverickElements {
    'media-thumbnail': MediaThumbnailElement;
  }
}

/**
 * Used to load and display a preview thumbnail at the given `time`.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/thumbnail}
 * @example
 * ```html
 * <media-player thumbnails="https://media-files.vidstack.io/thumbnails.vtt">
 *   <!-- ... -->
 *   <media-thumbnail time="10"></media-thumbnail>
 * </media-player>
 * ```
 */
export class Thumbnail extends Component<ThumbnailAPI> {
  static el = defineElement<ThumbnailAPI>({
    tagName: 'media-thumbnail',
    props: { time: 0 },
  });

  protected _media!: MediaContext;
  protected _img: HTMLImageElement | null = null;
  protected _coords: ThumbnailCoords | null = null;
  protected _styleResets: (() => void)[] = [];

  protected _src = signal('');
  protected _loaded = signal(false);
  protected _activeCue = signal<VTTCue | null>(null);

  constructor(instance: ComponentInstance<ThumbnailAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onAttach() {
    this.setAttributes({
      'data-loading': this._isLoading.bind(this),
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
    });
  }

  protected override onConnect() {
    effect(this._onLoadStart.bind(this));
    effect(this._onFindActiveCue.bind(this));
    effect(this._onResolveThumbnail.bind(this));
  }

  protected _onLoadStart() {
    this._src();
    this._media.$store.thumbnails();
    this._loaded.set(false);
  }

  protected _onLoaded() {
    this._loaded.set(true);
    this._requestResize();
  }

  protected _isLoading() {
    return !this._isHidden() && !this._loaded();
  }

  protected _isHidden() {
    const { duration, thumbnailCues } = this._media.$store;
    return !Number.isFinite(duration()) || thumbnailCues().length === 0;
  }

  protected _onFindActiveCue() {
    const { time } = this.$props,
      { duration, thumbnailCues } = this._media.$store,
      _cues = thumbnailCues(),
      _time = time();

    if (!_cues || !Number.isFinite(duration())) {
      this._activeCue.set(null);
      return;
    }

    this._activeCue.set(findActiveCue(_time, _cues));
  }

  protected _onImgRef(el: HTMLImageElement) {
    this._img = el;
  }

  protected _onResolveThumbnail() {
    const activeCue = this._activeCue(),
      thumbnails = peek(this._media.$store.thumbnails);

    if (!thumbnails || !activeCue) {
      this._src.set('');
      this._resetStyles();
      return;
    }

    const [_src, _coords = ''] = (activeCue.text || '').split('#');
    this._coords = this._resolveThumbnailCoords(_coords);

    if (!this._coords) {
      this._resetStyles();
      return;
    }

    this._src.set(this._resolveThumbnailSrc(thumbnails, _src));
    this._requestResize();
  }

  protected _resolveThumbnailSrc(baseURL: string, src: string) {
    return !/https?:/.test(src)
      ? `${baseURL.split('/').slice(0, -1).join('/')}${src.replace(/^\/?/, '/')}`.replace(
          /^\/\//,
          '/',
        )
      : src;
  }

  protected _resolveThumbnailCoords(coords: string) {
    const [props, values] = coords.split('='),
      resolvedCoords = {},
      coordValues = values.split(',');

    if (!props || !values) return null;

    for (let i = 0; i < props.length; i++) resolvedCoords[props[i]] = +coordValues[i];

    return resolvedCoords as ThumbnailCoords;
  }

  protected _rafId = -1;
  protected _requestResize() {
    if (this._rafId > 0) return;
    this._rafId = requestAnimationFrame(() => {
      this._resize();
      this._rafId = -1;
    });
  }

  protected _resize() {
    if (!this._img || !this._coords) return;
    const { w, h, x, y } = this._coords,
      { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(this.el!),
      minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h),
      maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h),
      scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;

    this._style(this.el!, '--thumbnail-width', `${w * scale}px`);
    this._style(this.el!, '--thumbnail-height', `${h * scale}px`);
    this._style(this._img, 'width', `${this._img.naturalWidth * scale}px`);
    this._style(this._img, 'height', `${this._img.naturalHeight * scale}px`);
    this._style(this._img, 'transform', `translate(-${x * scale}px, -${y * scale}px)`);
  }

  protected _style(el: HTMLElement, name: string, value: string) {
    el.style.setProperty(name, value);
    this._styleResets.push(() => el.style.removeProperty(name));
  }

  protected _resetStyles() {
    for (const reset of this._styleResets) reset();
    this._styleResets = [];
  }

  override render() {
    const { crossorigin } = this._media.$store;
    return (
      <img
        src={this._src()}
        crossorigin={crossorigin()}
        part="img"
        loading="eager"
        decoding="async"
        aria-hidden="true"
        $on:load={this._onLoaded.bind(this)}
        $ref={this._onImgRef.bind(this)}
      />
    );
  }
}

export interface ThumbnailAPI {
  props: ThumbnailProps;
}

export interface ThumbnailProps {
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

export interface MediaThumbnailElement extends HTMLCustomElement<Thumbnail> {}
