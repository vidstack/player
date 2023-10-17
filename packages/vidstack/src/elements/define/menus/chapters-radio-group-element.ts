import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { ChaptersRadioGroup, type ChaptersRadioOption } from '../../../components';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the chapter option title.
 * @part start-time - Contains the chapter option start time.
 * @part duration - Contains the chapter option duration.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/chapters-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-menu-button aria-label="Chapters">
 *     <media-icon type="chapters"></media-icon>
 *   </media-menu-button>
 *   <media-chapters-radio-group thumbnails="...">
 *     <template>
 *       <media-radio>
 *         <media-thumbnail></media-thumbnail>
 *         <span data-part="label"></span>
 *         <span data-part="start-time"></span>
 *         <span data-part="duration"></span>
 *       </media-radio>
 *     </template>
 *    </media-chapters-radio-group>
 * </media-menu>
 * ```
 */
export class MediaChaptersRadioGroupElement extends Host(HTMLElement, ChaptersRadioGroup) {
  static tagName = 'media-chapters-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this, (el, option) => {
      const { cue, startTime, duration } = option as ChaptersRadioOption,
        thumbnailEl = el.querySelector('.vds-thumbnail,media-thumbnail'),
        startEl = el.querySelector('[data-part="start-time"]'),
        durationEl = el.querySelector('[data-part="duration"]');

      if (startEl) startEl.textContent = startTime;

      if (durationEl) durationEl.textContent = duration;

      if (thumbnailEl) {
        thumbnailEl.setAttribute('time', cue.startTime + '');
        effect(() => {
          const { thumbnails } = this.$props;
          thumbnailEl.setAttribute('src', thumbnails());
        });
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-chapters-radio-group': MediaChaptersRadioGroupElement;
  }
}
