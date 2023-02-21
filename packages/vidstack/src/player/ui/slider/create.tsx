import {
  effect,
  getScope,
  peek,
  provideContext,
  ReadSignal,
  scoped,
  Signals,
  useContext,
} from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { ariaBool, mergeProperties, setStyle } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { sliderValueFormattersContext } from './format';
import type { SliderProps } from './props';
import { SliderStore, sliderStoreContext } from './store';
import type { MediaSliderElement, SliderMembers } from './types';
import { SliderEventCallbacks, useSliderEvents } from './use-events';
import { getClampedValue } from './utils';

/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export function createSlider(
  host: CustomElementHost<MediaSliderElement>,
  { $props, readonly, aria, ...callbacks }: SliderInit,
  accessors: () => SliderProps,
): Slider {
  provideContext(sliderStoreContext);
  provideContext(sliderValueFormattersContext);

  const scope = getScope()!,
    $store = useContext(sliderStoreContext),
    { $disabled, $min, $max, $value, $step } = $props;

  host.setAttributes({
    disabled: $disabled,
    dragging: () => $store.dragging,
    pointing: () => $store.pointing,
    interactive: () => $store.interactive,
    'aria-disabled': () => ariaBool($disabled()),
    'aria-valuemin': aria?.valueMin ?? (() => $store.min),
    'aria-valuemax': aria?.valueMax ?? (() => $store.max),
    'aria-valuenow': aria?.valueNow ?? (() => Math.round($store.value)),
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
    if (!target || $disabled()) return;

    const preview = target.querySelector('[slot="preview"]') as HTMLElement;
    if (!preview) return;

    const rect = preview.getBoundingClientRect();
    const styles = {
      '--computed-width': rect.width + 'px',
      '--computed-height': rect.height + 'px',
      '--preview-top':
        'calc(-1 * var(--media-slider-preview-gap, calc(var(--preview-height) + 8px)))',
      '--preview-width': 'var(--media-slider-preview-width, var(--computed-width))',
      '--preview-height': 'var(--media-slider-preview-height, var(--computed-height))',
      '--preview-width-half': 'calc(var(--preview-width) / 2)',
      '--preview-left-clamp': 'max(var(--preview-width-half), var(--slider-pointer-percent))',
      '--preview-right-clamp': 'calc(100% - var(--preview-width-half))',
      '--preview-left': 'min(var(--preview-left-clamp), var(--preview-right-clamp))',
    };

    for (const name of Object.keys(styles)) {
      setStyle(preview, name, styles[name]);
    }

    let stabilize = false;
    const observer = new ResizeObserver(function onPreviewResize([entry]) {
      if (stabilize) {
        stabilize = false;
        return;
      }

      const { inlineSize, blockSize } = entry.borderBoxSize?.[0] || {
        inlineSize: entry.contentRect.width,
        blockSize: entry.contentRect.height,
      };

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
    members: mergeProperties(
      $store,
      accessors(),
      {
        $store,
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
        subscribe: (callback) => scoped(() => effect(() => callback($store)), scope)!,
        $render: () => {
          return (
            <>
              <div part="track"></div>
              <div part="track track-fill"></div>
              <div part="track track-progress"></div>
              <div part="thumb-container">
                <div part="thumb"></div>
              </div>
            </>
          );
        },
      },
      {},
    ),
  };
}

export interface Slider {
  $store: SliderStore;
  members: SliderMembers;
}

export interface SliderInit extends SliderEventCallbacks {
  $props: Signals<SliderProps>;
  readonly?: boolean;
  aria?: {
    valueMin?: number | ReadSignal<number>;
    valueMax?: number | ReadSignal<number>;
    valueNow?: number | ReadSignal<number>;
    valueText?: string | ReadSignal<string>;
  };
}
