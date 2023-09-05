import {
  arrow,
  autoUpdate,
  computePosition,
  shift,
  type ComputePositionConfig,
  type Placement,
} from '@floating-ui/dom';
import { tick } from 'svelte';

import { hasAnimation } from '../utils/dom';
import { listenEvent } from '../utils/events';

export interface PopperDelegate {
  triggerEl: HTMLElement | null;
  contentEl: HTMLElement | null;
  arrowEl?: HTMLElement | null;
  onChange?(isShowing: boolean, trigger?: Event): void;
}

export interface PopperOptions extends Omit<ComputePositionConfig, 'placement'> {
  placement?: Placement | false;
  showDelay?: number;
}

export function createPopper(delegate: PopperDelegate, options: PopperOptions) {
  let _showTimerId = -1,
    _hideRafId = -1,
    noPlacement = options.placement === false,
    _stopAnimationListener: (() => void) | null = null;

  function show(trigger?: Event, onChange?: () => void) {
    window.cancelAnimationFrame(_hideRafId);
    _hideRafId = -1;

    _stopAnimationListener?.();
    _stopAnimationListener = null;

    _showTimerId = window.setTimeout(() => {
      _showTimerId = -1;

      if (!delegate.contentEl) return;

      function onShow() {
        tick();
        onChange?.();
        delegate.onChange?.(true, trigger);
        _stopAnimationListener = null;
      }

      delegate.contentEl.style.display = '';
      position();

      const isAnimated = delegate.contentEl && hasAnimation(delegate.contentEl);
      if (isAnimated) {
        const stop = listenEvent(delegate.contentEl, 'animationend', onShow, { once: true });
        _stopAnimationListener = stop;
      } else {
        onShow();
      }
    }, options.showDelay ?? 0);
  }

  function hide(trigger?: Event, onChange?: () => void) {
    window.clearTimeout(_showTimerId);
    _showTimerId = -1;

    _stopAnimationListener?.();
    _stopAnimationListener = null;

    _hideRafId = requestAnimationFrame(() => {
      _hideRafId = -1;
      if (delegate.contentEl) {
        function onHide() {
          tick();
          onChange?.();
          delegate.onChange?.(false, trigger);
          _stopAnimationListener = null;
          if (delegate.contentEl) delegate.contentEl.style.display = 'none';
        }

        const isAnimated = hasAnimation(delegate.contentEl);
        if (isAnimated) {
          const stop = listenEvent(delegate.contentEl, 'animationend', onHide, { once: true });
          _stopAnimationListener = stop;
        } else {
          onHide();
        }
      }
    });
  }

  function position() {
    if (noPlacement || !delegate.triggerEl || !delegate.contentEl) return;

    const middleware = options.middleware || [];
    middleware.push(shift({ padding: 8 }));

    const position = computePosition(delegate.triggerEl, delegate.contentEl, {
      ...options,
      placement: options.placement as Placement,
      middleware: !delegate.arrowEl
        ? middleware
        : [...middleware, arrow({ element: delegate.arrowEl })],
    });

    position.then(({ x, y, middlewareData }) => {
      if (!delegate.contentEl) return;

      Object.assign(delegate.contentEl.style, {
        top: y + 'px',
        left: x + 'px',
      });

      if (delegate.arrowEl && middlewareData.arrow) {
        const { x, y } = middlewareData.arrow;

        const side = (options.placement as Placement).split('-')[0],
          staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
          }[side] as any;

        Object.assign(delegate.arrowEl.style, {
          top: y != null ? `${y}px` : '',
          left: x != null ? `${x}px` : '',
          [staticSide]: `${-delegate.arrowEl.offsetWidth}px`,
        });
      }
    });
  }

  function watchPosition() {
    if (noPlacement || !delegate.triggerEl || !delegate.contentEl) return null;
    return autoUpdate(delegate.triggerEl, delegate.contentEl, position);
  }

  return {
    show,
    hide,
    position,
    watchPosition,
  };
}
