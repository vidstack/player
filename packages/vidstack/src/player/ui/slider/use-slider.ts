import { effect, peek, provideContext, ReadSignal, Signals, useContext } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { ariaBool, mergeProperties, setStyle } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import type { SliderProps } from './props';
import { SliderStore, SliderStoreContext } from './store';
import type { SliderElement, SliderMembers } from './types';
import { SliderEventCallbacks, useSliderEvents } from './use-events';
import { getClampedValue } from './utils';

/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export function useSlider(
  host: CustomElementHost<SliderElement>,
  { $props, readonly, aria, ...callbacks }: UseSliderProps,
  accessors: () => SliderProps,
): UseSlider {
  provideContext(SliderStoreContext);

  const $store = useContext(SliderStoreContext),
    { $disabled, $min, $max, $value, $step } = $props;

  host.setAttributes({
    disabled: $props.$disabled,
    dragging: () => $store.dragging,
    pointing: () => $store.pointing,
    interactive: () => $store.interactive,
    'aria-disabled': () => ariaBool($disabled()),
    'aria-valuemin': aria?.valueMin ?? (() => $store.min),
    'aria-valuemax': aria?.valueMax ?? (() => $store.max),
    'aria-valuenow': aria?.valueNow ?? (() => $store.value),
    'aria-valuetext': aria?.valueText ?? (() => round(($store.value / $store.max) * 100, 2) + '%'),
  });

  host.setCSSVars({
    '--slider-fill-rate': () => $store.fillRate,
    '--slider-fill-value': () => $store.value,
    '--slider-fill-percent': () => $store.fillPercent + '%',
    '--slider-pointer-rate': () => $store.pointerRate,
    '--slider-pointer-value': () => $store.pointerValue,
    '--slider-pointer-percent': () => $store.pointerPercent + '%',
  });

  useFocusVisible(host.$el);
  useSliderEvents(host, $props, callbacks, $store);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'role', 'slider');
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(host.el!, 'autocomplete', 'off');
  });

  effect(() => {
    const target = host.$el();
    if (!target) return;

    const preview = target.querySelector('[slot="preview"]') as HTMLElement;
    if (!preview) return;

    let stabilize = false;
    const observer = new ResizeObserver(function onPreviewResize([entry]) {
      if (stabilize) {
        stabilize = false;
        return;
      }
      const { inlineSize, blockSize } = entry.borderBoxSize[0];
      setStyle(preview, '--computed-width', inlineSize + 'px');
      setStyle(preview, '--computed-height', blockSize + 'px');
      stabilize = true;
    });

    observer.observe(preview);
    return () => observer.disconnect();
  });

  if (!readonly) {
    effect(() => {
      $store.min = $min();
      $store.max = $max();
    });

    effect(() => {
      if (peek(() => $store.dragging)) return;
      $store.value = getClampedValue($store.min, $store.max, $value(), $step());
    });
  }

  effect(() => {
    if (!$disabled()) return;
    $store.dragging = false;
    $store.pointing = false;
  });

  return {
    $store,
    members: mergeProperties($store, accessors(), {
      get dragging() {
        return $store.dragging;
      },
      get pointing() {
        return $store.pointing;
      },
      get value() {
        return $store.value;
      },
      set value(value) {
        $store.value = value;
      },
    }),
  };
}

export interface UseSlider {
  $store: SliderStore;
  members: SliderMembers;
}

export interface UseSliderProps extends SliderEventCallbacks {
  $props: Signals<SliderProps>;
  readonly?: boolean;
  aria?: {
    valueMin?: number | ReadSignal<number>;
    valueMax?: number | ReadSignal<number>;
    valueNow?: number | ReadSignal<number>;
    valueText?: string | ReadSignal<string>;
  };
}
