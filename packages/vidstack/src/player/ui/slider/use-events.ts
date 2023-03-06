import { effect, Signals } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import { createEvent, dispatchEvent, isKeyboardEvent, listenEvent } from 'maverick.js/std';

import { IS_SAFARI } from '../../../utils/support';
import { useMedia } from '../../media/context';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from './events';
import type { SliderStore } from './store';
import type { MediaSliderElement, SliderProps } from './types';
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
  host: CustomElementHost<MediaSliderElement>,
  { $disabled, $step, $keyStep, $shiftKeyMultiplier }: Signals<SliderProps>,
  { onValueChange, onDragStart, onDragValueChange, onDragEnd }: SliderEventCallbacks,
  $store: SliderStore,
) {
  const remote = useMedia().remote;

  effect(() => {
    const target = host.$el();
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
    if (IS_SAFARI) listenEvent(document, 'touchmove', onDocumentTouchMove, { passive: false });
  });

  function getValue(event: PointerEvent) {
    const thumbClientX = event.clientX;
    const { left: trackLeft, width: trackWidth } = host.el!.getBoundingClientRect();
    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    return getValueFromRate($store.min, $store.max, thumbPositionRate, $step());
  }

  function updateValue(value: number, trigger?: Event) {
    $store.value = Math.max($store.min, Math.min(value, $store.max));

    const event = createEvent(host.el, 'value-change', { detail: $store.value, trigger });
    host.el?.dispatchEvent(event);
    onValueChange?.(event);

    if ($store.dragging) {
      const event = createEvent(host.el, 'drag-value-change', { detail: value, trigger });
      host.el?.dispatchEvent(event);
      onDragValueChange?.(event);
    }
  }

  function updatePointerValue(value: number, trigger?: Event) {
    if ($store.dragging) updateValue(value, trigger);
    $store.pointerValue = value;
    dispatchEvent(host.el, 'pointer-value-change', { detail: value, trigger });
  }

  function onPointerEnter() {
    $store.pointing = true;
  }

  function onPointerMove(event: PointerEvent) {
    // Avoid double updates - use document pointer move.
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

    if (key === 'Home' || key === 'PageUp') {
      updateValue($store.min, event);
    } else if (key === 'End' || key === 'PageDown') {
      updateValue($store.max, event);
    } else if (/[0-9]/.test(key)) {
      updateValue((($store.max - $store.min) / 10) * Number(key), event);
    }

    const isValidKey = Object.keys(SliderKeyDirection).includes(key);
    if (!isValidKey) return;

    const modifiedStep = !shiftKey ? $keyStep() : $keyStep() * $shiftKeyMultiplier();

    const direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      steps = ($store.value + diff) / $step();

    updateValue($step() * steps, event);
  }

  function onStartDragging(event: PointerEvent) {
    if ($store.dragging) return;
    $store.dragging = true;
    const value = getValue(event);
    updatePointerValue(value, event);
    remote.pauseUserIdle(event);
    const dragStartEvent = createEvent(host.el, 'drag-start', {
      detail: value,
      trigger: event,
    });
    host.el?.dispatchEvent(dragStartEvent);
    onDragStart?.(dragStartEvent);
  }

  function onStopDragging(event: PointerEvent) {
    if (!$store.dragging) return;
    $store.dragging = false;
    const value = getValue(event);
    updateValue(value, event);
    updatePointerValue(value, event);
    remote.resumeUserIdle(event);
    const dragEndEvent = createEvent(host.el, 'drag-start', {
      detail: value,
      trigger: event,
    });
    host.el?.dispatchEvent(dragEndEvent);
    onDragEnd?.(dragEndEvent);
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

export interface SliderEventCallbacks {
  onValueChange?(event: SliderValueChangeEvent): void;
  onDragStart?(event: SliderDragStartEvent): void;
  onDragValueChange?(event: SliderDragValueChangeEvent): void;
  onDragEnd?(event: SliderDragEndEvent): void;
}
