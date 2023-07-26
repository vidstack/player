import type { ActionReturn } from 'svelte/action';
import { readonly, writable } from 'svelte/store';
import { DisposalBin, listenEvent } from '../utils/events';
import { createPopper, PopperOptions } from './popper';

let id = 0;

export interface AriaTooltipOptions extends PopperOptions {}

export function createAriaTooltip(options: AriaTooltipOptions) {
  let _id = `aria-tooltip-${++id}`,
    _triggerEl: HTMLElement | null = null,
    _contentEl: HTMLElement | null = null,
    _arrowEl: HTMLElement | null = null,
    _isTooltipOpen = writable(false),
    _popper = createPopper(
      {
        get triggerEl() {
          return _triggerEl;
        },
        get contentEl() {
          return _contentEl;
        },
        get arrowEl() {
          return _arrowEl;
        },
      },
      { showDelay: 700, ...options },
    );

  return {
    isTooltipOpen: readonly(_isTooltipOpen),
    tooltipTrigger(triggerEl: HTMLElement): ActionReturn {
      let disposal = new DisposalBin(),
        _stopWatchingPosition: (() => void) | null = null;

      _triggerEl = triggerEl;
      triggerEl.setAttribute('aria-describedby', _id);

      function onShow() {
        if (!_contentEl) return;

        _stopWatchingPosition?.();
        if (!options.noPositioning) {
          _stopWatchingPosition = _popper.watchPosition();
        }

        _popper.show();

        requestAnimationFrame(() => {
          _isTooltipOpen.set(true);
        });
      }

      function onHide() {
        if (!_contentEl) return;

        _popper.hide();

        _stopWatchingPosition?.();
        _stopWatchingPosition = null;

        requestAnimationFrame(() => {
          _isTooltipOpen.set(false);
        });
      }

      disposal.add(
        listenEvent(triggerEl, 'focus', onShow),
        listenEvent(triggerEl, 'pointerenter', onShow),
        listenEvent(triggerEl, 'blur', onHide),
        listenEvent(triggerEl, 'pointerleave', onHide),
      );

      return {
        destroy() {
          _stopWatchingPosition?.();
          disposal.dispose();
          _triggerEl = null;
        },
      };
    },
    tooltipContent(contentEl: HTMLElement): ActionReturn {
      const disposal = new DisposalBin();

      _contentEl = contentEl;
      contentEl.style.display = 'none';
      contentEl.setAttribute('id', _id);
      contentEl.setAttribute('role', 'tooltip');
      if (!options.noPositioning) contentEl.style.position = 'absolute';

      return {
        destroy() {
          disposal.dispose();
          _contentEl = null;
        },
      };
    },
    tooltipArrow(el: HTMLElement): ActionReturn {
      _arrowEl = el;
      return {
        destroy() {
          _arrowEl = null;
        },
      };
    },
  };
}
