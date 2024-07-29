import { effect } from 'maverick.js';
import { Host, type Attributes } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { Thumbnail, type ThumbnailProps } from '../../components/ui/thumbnails/thumbnail';
import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { cloneTemplateContent, createTemplate } from '../../utils/dom';

const imgTemplate = /* #__PURE__*/ createTemplate(
  '<img loading="eager" decoding="async" aria-hidden="true">',
);

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/thumbnail}
 * @example
 * ```html
 * <media-player>
 *   <!-- ... -->
 *   <media-thumbnail
 *     src="https://files.vidstack.io/thumbnails.vtt"
 *     time="10"
 *   ></media-thumbnail>
 * </media-player>
 * ```
 */
export class MediaThumbnailElement extends Host(HTMLElement, Thumbnail) {
  static tagName = 'media-thumbnail';

  static override attrs: Attributes<ThumbnailProps> = {
    crossOrigin: 'crossorigin',
  };

  #media!: MediaContext;
  #img = this.#createImg();

  protected onSetup(): void {
    this.#media = useMediaContext();
    this.$state.img.set(this.#img);
  }

  protected onConnect(): void {
    const { src, crossOrigin } = this.$state;

    if (this.#img.parentNode !== this) {
      this.prepend(this.#img);
    }

    effect(() => {
      setAttribute(this.#img, 'src', src());
      setAttribute(this.#img, 'crossorigin', crossOrigin());
    });
  }

  #createImg() {
    return cloneTemplateContent<HTMLImageElement>(imgTemplate);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-thumbnail': MediaThumbnailElement;
  }
}
