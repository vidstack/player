import { listen } from 'svelte/internal';

export function isFocusing(
  node: Node,
  callback: (isFocusing: boolean) => void,
): SvelteActionReturnType {
  const focusListenerOff = listen(node, 'focus', () => callback(true));
  const blurListenerOff = listen(node, 'blur', () => callback(false));

  return {
    destroy() {
      focusListenerOff();
      blurListenerOff();
    },
  };
}
