import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import {
  ChaptersRadioGroup,
  type ChaptersRadioOption,
} from '../../../components/ui/menu/radio-groups/chapters-radio-group';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the chapter option title.
 * @part start-time - Contains the chapter option start time.
 * @part duration - Contains the chapter option duration.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/chapters-radio-group}
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
          const thumbnails = this.$props.thumbnails();
          if ('src' in thumbnailEl) {
            thumbnailEl.src = thumbnails;
          } else if (isString(thumbnails)) {
            thumbnailEl.setAttribute('src', thumbnails);
          }
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
