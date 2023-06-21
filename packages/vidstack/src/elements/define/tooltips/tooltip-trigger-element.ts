import { Host } from 'maverick.js/element';

import { TooltipTrigger } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 * @example
 * ```html
 * <media-tooltip>
 *   <media-tooltip-trigger>
 *     <media-play-button></media-play-button>
 *   </media-tooltip-trigger>
 *   <media-tooltip-content placement="top start">
 *      <span data-state="play">Play</span>
 *      <span data-state="pause">Pause</span>
 *   </media-tooltip-content>
 * </media-tooltip>
 * ```
 */
export class MediaTooltipTriggerElement extends Host(HTMLElement, TooltipTrigger) {
  static tagName = 'media-tooltip-trigger';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-tooltip-trigger': MediaTooltipTriggerElement;
  }
}
