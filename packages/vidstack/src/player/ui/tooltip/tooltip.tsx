import { hasProvidedContext, useContext } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { scopedRaf } from '../../../utils/dom';
import { tooltipContext } from './context';

declare global {
  interface MaverickElements {
    'media-tooltip': MediaTooltipElement;
  }
}

/**
 * A contextual text bubble that displays a description for an element that appears on pointer
 * hover or keyboard focus.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/tooltip}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role}
 * @example
 * ```html
 * <media-play-button>
 *   <media-tooltip position="top left">
 *     <span slot="play">Play</span>
 *     <span slot="pause">Pause</span>
 *   </media-tooltip>
 * </media-play-button>
 * ```
 */
export class Tooltip extends Component<TooltipAPI> {
  static el = defineElement<TooltipAPI>({
    tagName: 'media-tooltip',
    props: { position: 'top center' },
  });

  protected override onAttach(el: HTMLElement): void {
    if (hasProvidedContext(tooltipContext)) {
      scopedRaf(() => {
        if (!el.isConnected) return;
        const tooltip = useContext(tooltipContext);
        tooltip._attachTooltip(el);
      });
    }

    this.setAttributes({
      position: this.$props.position,
    });
  }
}

export interface TooltipAPI {
  props: TooltipProps;
}

export type TooltipXPosition = 'left' | 'center' | 'right';
export type TooltipYPosition = 'top' | 'bottom';
export type TooltipPosition = `${TooltipYPosition} ${TooltipXPosition}`;

export interface TooltipProps {
  /**
   * Specifies the position at which the tooltip is placed.
   *
   * @example `top left`
   */
  position: TooltipPosition;
}

export interface MediaTooltipElement extends HTMLCustomElement<Tooltip> {}
