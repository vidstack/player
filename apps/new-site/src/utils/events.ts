import { onDestroy } from 'svelte';

export function listenEvent<
  Target extends EventTarget,
  Events = Target extends Document
    ? DocumentEventMap
    : Target extends Window
    ? WindowEventMap
    : GlobalEventHandlersEventMap,
  Type extends keyof Events = keyof Events,
>(
  target: Target,
  type: Type,
  callback: (event: Events[Type]) => void,
  options?: EventListenerOptions,
) {
  target.addEventListener(type as any, callback as any, options);
  return () => target.removeEventListener(type as any, callback as any);
}

export function createDisposalBin() {
  let bin: (() => void)[] = [];

  function add(callback: () => void) {
    bin.push(callback);
  }

  function dispose() {
    bin.forEach((fn) => fn());
    bin = [];
  }

  try {
    onDestroy(dispose);
  } catch (e) {
    //
  }

  return {
    add,
    dispose,
  };
}
