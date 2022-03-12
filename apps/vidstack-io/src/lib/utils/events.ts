import { onDestroy } from 'svelte';

export function createDisposalBin() {
  let bin = [];

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
