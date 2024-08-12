import { Component, effect, onDispose, useContext } from 'maverick.js';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { autoPlacement, requestScopedAnimationFrame } from '../../../utils/dom';
import { tooltipContext } from './tooltip-context';

/**
 * This component contains the content that is visible when the tooltip trigger is interacted with.
 *
 * @attr data-visible - Whether tooltip is visible.
 * @attr data-placement - The placement prop setting.
 * @attr data-hocus - Whether tooltip is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 */
export class TooltipContent extends Component<TooltipContentProps> {
  static props: TooltipContentProps = {
    placement: 'top center',
    offset: 0,
    alignOffset: 0,
  };

  constructor() {
    super();
    new FocusVisibleController();

    const { placement } = this.$props;
    this.setAttributes({
      'data-placement': placement,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    this.#attach(el);

    Object.assign(el.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'max-content',
    });
  }

  protected override onConnect(el: HTMLElement): void {
    this.#attach(el);

    const tooltip = useContext(tooltipContext);
    onDispose(() => tooltip.detachContent(el));

    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.#watchPlacement.bind(this));
      }),
    );
  }

  #attach(el: HTMLElement) {
    const tooltip = useContext(tooltipContext);
    tooltip.attachContent(el);
  }

  #watchPlacement() {
    const { showing } = useContext(tooltipContext);
    if (!showing()) return;

    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this.#getTrigger(), placement(), {
      offsetVarName: 'media-tooltip',
      xOffset: alignOffset(),
      yOffset: mainOffset(),
    });
  }

  #getTrigger() {
    return useContext(tooltipContext).trigger();
  }
}

export type TooltipPlacement =
  | TooltipPlacementSide
  | `${TooltipPlacementSide} ${TooltipPlacementAlign}`;

export type TooltipPlacementSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipPlacementAlign = 'start' | 'center' | 'end';

export interface TooltipContentProps {
  /**
   * A space-separated list which specifies the side and alignment of the tooltip content relative
   * to the trigger.
   *
   * @example `top center`
   * @example `bottom end`
   */
  placement: TooltipPlacement;
  /**
   * The distance in pixels between the content and the tooltip trigger. You can also set
   * the CSS variable `--media-tooltip-y-offset` to adjust this offset.
   */
  offset: number;
  /**
   * The offset in pixels from the start/center/end aligned position. You can also set
   * the CSS variable `--media-tooltip-x-offset` to adjust this offset.
   */
  alignOffset: number;
}
