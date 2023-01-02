import { effect, peek, ReadSignal, Signals } from 'maverick.js';
import { dispatchEvent, listenEvent } from 'maverick.js/std';

import { useMediaRemoteControl } from '../../media/remote-control';
import type { SliderStore } from './store';
import type { SliderElement, SliderProps } from './types';
import { getValueFromRate } from './utils';

/**
 * The direction to move the thumb, associated with key symbols.
 */
const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: -1,
  ArrowUp: -1,
  Right: 1,
  ArrowRight: 1,
  Down: 1,
  ArrowDown: 1,
} as const;

export function useSliderEvents(
  $target: ReadSignal<SliderElement | null>,
  { $disabled, $step, $keyboardStep, $shiftKeyMultiplier }: Signals<SliderProps>,
  $store: SliderStore,
) {
  const remote = useMediaRemoteControl($target);

  effect(() => {
    const target = $target();
    if (!target || $disabled()) return;
    listenEvent(target, 'pointerenter', onPointerEnter);
    listenEvent(target, 'pointermove', onPointerMove);
    listenEvent(target, 'pointerleave', onPointerLeave);
    listenEvent(target, 'pointerdown', onPointerDown);
    listenEvent(target, 'keydown', onKeyDown);
  });

  effect(() => {
    if ($disabled() || !$store.dragging) return;
    listenEvent(document, 'pointerup', onDocumentPointerUp);
    listenEvent(document, 'pointermove', onDocumentPointerMove);
    listenEvent(document, 'touchmove', onDocumentTouchMove, { passive: true });
  });

  let target: SliderElement | null = null;
  effect(() => {
    target = $target();
  });

  let valueTriggerEvent: Event | undefined;
  effect(() => {
    dispatchEvent(target, 'vds-slider-value-change', {
      detail: $store.value,
      trigger: valueTriggerEvent,
    });

    valueTriggerEvent = undefined;
  });

  let pointerTriggerEvent: Event | undefined;
  effect(() => {
    const pointerValue = $store.pointerValue;

    dispatchEvent(target, 'vds-slider-pointer-value-change', {
      detail: pointerValue,
      trigger: pointerTriggerEvent,
    });

    if (peek(() => $store.dragging)) {
      dispatchEvent(target, 'vds-slider-drag-value-change', {
        detail: pointerValue,
        trigger: pointerTriggerEvent,
      });
    }

    pointerTriggerEvent = undefined;
  });

  let dragTriggerEvent: Event | undefined;
  effect(() => {
    dispatchEvent(target, $store.dragging ? 'vds-slider-drag-start' : 'vds-slider-drag-end', {
      detail: peek(() => $store.value),
      trigger: dragTriggerEvent,
    });

    dragTriggerEvent = undefined;
  });

  function getValue(event: PointerEvent) {
    const thumbClientX = event.clientX;
    const { left: trackLeft, width: trackWidth } = target!.getBoundingClientRect();
    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    return getValueFromRate($store.min, $store.max, thumbPositionRate, $step());
  }

  function updateValue(value: number, trigger?: Event) {
    $store.value = value;
    valueTriggerEvent = trigger;
  }

  function updatePointerValue(value: number, trigger?: Event) {
    $store.pointerValue = value;
    pointerTriggerEvent = trigger;
  }

  function onPointerEnter() {
    $store.pointing = true;
  }

  function onPointerMove(event: PointerEvent) {
    if ($store.dragging) return;
    updatePointerValue(getValue(event), event);
  }

  function onPointerLeave(event: PointerEvent) {
    $store.pointing = false;
  }

  function onPointerDown(event: PointerEvent) {
    onStartDragging(event);
    updatePointerValue(getValue(event), event);
  }

  function onKeyDown(event: KeyboardEvent) {
    const { key, shiftKey } = event;

    const isValidKey = Object.keys(SliderKeyDirection).includes(key);
    if (!isValidKey) return;

    const modifiedStep = !shiftKey ? $keyboardStep() : $keyboardStep() * $shiftKeyMultiplier();

    const direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      steps = ($store.value + diff) / $step();

    updateValue($step() * steps, event);
  }

  function onStartDragging(event: PointerEvent) {
    if ($store.dragging) return;
    $store.dragging = true;
    updatePointerValue(getValue(event), event);
    remote.pauseUserIdle(event);
    dragTriggerEvent = event;
  }

  function onStopDragging(event: PointerEvent) {
    if (!$store.dragging) return;
    $store.dragging = false;
    const value = getValue(event);
    updateValue(value, event);
    updatePointerValue(value, event);
    remote.resumeUserIdle(event);
    dragTriggerEvent = event;
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  function onDocumentPointerUp(event: PointerEvent) {
    onStopDragging(event);
  }

  function onDocumentTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  function onDocumentPointerMove(event: PointerEvent) {
    updatePointerValue(getValue(event), event);
  }
}
