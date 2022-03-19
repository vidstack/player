import { listen } from 'svelte/internal';

export function isHovering(
  node: Node,
  callback: (isHovering: boolean) => void,
): SvelteActionReturnType {
  const enterListenerOff = listen(node, 'pointerenter', () => callback(true));
  const leaveListenerOff = listen(node, 'pointerleave', () => callback(false));

  return {
    destroy() {
      enterListenerOff();
      leaveListenerOff();
    },
  };
}
