import { effect, peek, signal, useStore, type ReadSignal, type StoreContext } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { noop } from 'maverick.js/std';
import { parseResponse, type VTTCue } from 'media-captions';

import { useMedia, type MediaContext } from '../../core/api/context';
import { SliderStoreFactory } from './slider/api/store';

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-thumbnail': MediaSliderThumbnailElement;
  }
}

/**
 * Used to load/parse WebVTT files and display preview thumbnails when the user is hovering hover
 * or dragging the time slider. The time ranges in the WebVTT file will automatically be matched
 * based on the current pointer position.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-thumbnail}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-thumbnail
 *     src="https://media-files.vidstack.io/thumbnails.vtt"
 *     slot="preview"
 *   ></media-slider-thumbnail>
 * </media-time-slider>
 * ```
 */
export class SliderThumbnail extends Component<SliderThumbnailAPI> {
  static el = defineElement<SliderThumbnailAPI>({
    tagName: 'media-slider-thumbnail',
    props: { src: '' },
  });

  protected _media!: MediaContext;
  protected _slider!: StoreContext<typeof SliderStoreFactory>;

  protected _img = signal<HTMLImageElement | null>(null);
  protected _src = signal('');
  protected _loaded = signal(false);
  protected _coords = signal<ThumbnailCoords | null>(null);
  protected _cues = signal<VTTCue[] | null>(null);
  protected _activeCue = signal<VTTCue | null>(null);
  protected _hidden!: ReadSignal<boolean>;
  protected _styleReverts: (() => void)[] = [];

  protected override onAttach() {
    this._media = useMedia();
    this._slider = useStore(SliderStoreFactory);
    this._hidden = this._isHidden.bind(this);
    this.setAttributes({
      'data-loading': this._isLoading.bind(this),
      'data-hidden': this._hidden,
    });
  }

  protected override onConnect() {
    effect(this._onLoadCues.bind(this));
    effect(this._onFindActiveCue.bind(this));
    effect(this._onResolveThumbnail.bind(this));
    effect(this._onLoadStart.bind(this));
    effect(this._onResize.bind(this));
  }

  override render() {
    const { crossorigin } = this._media.$store;
    return (
      <div part="container">
        <img
          src={this._src()}
          crossorigin={crossorigin()}
          part="img"
          loading="eager"
          decoding="async"
          $on:load={this._onLoaded.bind(this)}
          $ref={this._img.set}
        />
      </div>
    );
  }

  protected _onLoadStart() {
    this._src();
    this._loaded.set(false);
  }

  protected _onLoaded() {
    this._loaded.set(true);
  }

  protected _isLoading() {
    return !this._hidden() && !this._loaded();
  }

  protected _isHidden() {
    const { duration } = this._media.$store;
    return !Number.isFinite(duration());
  }

  protected _onLoadCues() {
    const { canLoad } = this._media.$store;

    if (!canLoad()) return;

    this._loaded.set(false);

    const controller = new AbortController();
    parseResponse(fetch(this.$props.src(), { signal: controller.signal }))
      .then(({ cues }) => this._cues.set(cues))
      .catch(noop);

    return () => {
      controller.abort();
      this._cues.set(null);
    };
  }

  protected _onFindActiveCue() {
    const cues = this._cues();
    const { duration } = this._media.$store;

    if (!cues || !Number.isFinite(duration())) {
      this._activeCue.set(null);
      return;
    }

    const currentTime = this._slider.pointerRate() * duration();

    for (let i = 0; i < cues.length; i++) {
      if (currentTime >= cues[i].startTime && currentTime <= cues[i].endTime) {
        this._activeCue.set(cues[i]);
        break;
      }
    }
  }

  protected _onResolveThumbnail() {
    const cue = this._activeCue();

    if (!cue) {
      this._src.set('');
      this._coords.set(null);
      return;
    }

    const [src, coords] = (cue.text || '').split('#');
    const [props, values] = coords.split('=');

    this._src.set(
      !/https?:/.test(src)
        ? `${peek(this.$props.src).split('/').slice(0, -1).join('/')}${src.replace(
            /^\/?/,
            '/',
          )}`.replace(/^\/\//, '/')
        : src,
    );

    if (props && values) {
      const coords = {},
        coordValues = values.split(',');
      for (let i = 0; i < props.length; i++) coords[props[i]] = +coordValues[i];
      this._coords.set(coords as ThumbnailCoords);
    } else {
      this._coords.set(null);
    }
  }

  protected _onResize() {
    const img = this._img(),
      coords = this._coords();

    if (!img || !coords || !this._loaded()) {
      for (const revert of this._styleReverts) revert();
      return;
    }

    const { w, h, x, y } = coords,
      { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(this.el!),
      minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h),
      maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h),
      scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;

    this._styleReverts.length = 0;
    this._style(this.el!, '--thumbnail-width', `${w * scale}px`);
    this._style(this.el!, '--thumbnail-height', `${h * scale}px`);
    this._style(img, 'width', `${img.naturalWidth * scale}px`);
    this._style(img, 'height', `${img.naturalHeight * scale}px`);
    this._style(img, 'transform', `translate(-${x * scale}px, -${y * scale}px)`);
  }

  protected _style(el: HTMLElement, name: string, value: string, priority?: string) {
    el.style.setProperty(name, value, priority);
    this._styleReverts.push(() => el.style.removeProperty(name));
  }
}

interface ThumbnailCoords {
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface SliderThumbnailAPI {
  props: SliderThumbnailProps;
}

export interface SliderThumbnailProps {
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  src: string;
}

export interface MediaSliderThumbnailElement extends HTMLCustomElement<SliderThumbnail> {}
