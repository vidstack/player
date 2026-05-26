import { effect, onDispose } from 'maverick.js';
import { Host, type Attributes } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { Poster, type PosterProps } from '../../components/ui/poster';

const managedImgAttrs = [
  'alt',
  'crossorigin',
  'src',
  'loading',
  'decoding',
  'fetchpriority',
] as const;

type ManagedImgAttr = (typeof managedImgAttrs)[number];

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/poster}
 * @example
 * ```html
 * <media-player>
 *   <media-poster src="..." alt="Large alien ship hovering over New York."></media-poster>
 * </media-player>
 * ```
 */
export class MediaPosterElement extends Host(HTMLElement, Poster) {
  static tagName = 'media-poster';

  static override attrs: Attributes<PosterProps> = {
    crossOrigin: 'crossorigin',
    fetchPriority: 'fetchpriority',
  };

  #defaultImg = document.createElement('img');
  #customImgAttrs = new WeakMap<HTMLImageElement, Map<ManagedImgAttr, string>>();

  protected onSetup(): void {
    this.#updateImg();
  }

  protected onConnect(): void {
    const { src, alt, crossOrigin } = this.$state;
    const { loading, decoding, fetchPriority } = this.$props;

    this.#updateImg();

    const mutations = new MutationObserver(this.#updateImg.bind(this));
    mutations.observe(this, { childList: true });
    onDispose(() => mutations.disconnect());

    effect(() => {
      const img = this.$state.img();
      if (!img) return;

      const { loading, hidden } = this.$state;
      img.style.display = loading() || hidden() ? 'none' : '';
    });

    effect(() => {
      const img = this.$state.img();
      if (!img) return;

      this.#setImgAttr(img, 'alt', alt());
      this.#setImgAttr(img, 'crossorigin', crossOrigin());
      this.#setImgAttr(img, 'src', src());
      this.#setImgAttr(img, 'loading', loading());
      this.#setImgAttr(img, 'decoding', decoding());
      this.#setImgAttr(img, 'fetchpriority', fetchPriority());
    });
  }

  #updateImg(): void {
    const img = this.#findImg() ?? this.#defaultImg;

    if (img === this.#defaultImg) {
      if (this.#defaultImg.parentNode !== this) {
        this.prepend(this.#defaultImg);
      }
    } else {
      this.#saveCustomImgAttrs(img);
      this.#copySrcFromImg(img);
      this.#defaultImg.remove();
    }

    if (this.$state.img() !== img) {
      this.$state.img.set(img);
    }
  }

  #findImg(): HTMLImageElement | null {
    for (const child of this.children) {
      if (child.localName === 'img' && child !== this.#defaultImg) {
        return child as HTMLImageElement;
      }
    }

    return null;
  }

  #saveCustomImgAttrs(img: HTMLImageElement): void {
    if (this.#customImgAttrs.has(img)) return;

    const attrs = new Map<ManagedImgAttr, string>();

    for (const attr of managedImgAttrs) {
      const value = img.getAttribute(attr);
      if (value !== null) attrs.set(attr, value);
    }

    this.#customImgAttrs.set(img, attrs);
  }

  #copySrcFromImg(img: HTMLImageElement): void {
    if (this.$props.src() === null && img.hasAttribute('src')) {
      this.src = img.getAttribute('src') || '';
    }
  }

  #setImgAttr(img: HTMLImageElement, attr: ManagedImgAttr, value: string | null): void {
    if (img !== this.#defaultImg && this.#customImgAttrs.get(img)?.has(attr)) return;
    setAttribute(img, attr, value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-poster': MediaPosterElement;
  }
}
