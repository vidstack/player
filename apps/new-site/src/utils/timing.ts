export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeout: number;
  let called = false;

  return () => {
    if (timeout) {
      window.clearTimeout(timeout);
    }

    if (!called) {
      fn();
      called = true;
      window.setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeout = window.setTimeout(fn, delay);
    }
  };
}
