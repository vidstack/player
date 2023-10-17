import { Host } from 'maverick.js/element';

import { TooltipContent } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/tooltip}
 * @example
 * ```html
 * <media-tooltip>
 *   <media-tooltip-trigger>
 *     <media-play-button></media-play-button>
 *   </media-tooltip-trigger>
 *   <media-tooltip-content placement="top">
 *      <span class="play-tooltip-text">Play</span>
 *      <span class="pause-tooltip-text">Pause</span>
 *   </media-tooltip-content>
 * </media-tooltip>
 * ```
 */
export class MediaTooltipContentElement extends Host(HTMLElement, TooltipContent) {
  static tagName = 'media-tooltip-content';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-tooltip-content': MediaTooltipContentElement;
  }
}
