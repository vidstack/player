export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function skipFirst<T extends (...args: any[]) => any>(callback: T): T {
  let isFirst = true;

  function skipFirst(...args: any[]) {
    if (isFirst) {
      isFirst = false;
      return;
    }

    return callback(...args);
  }

  return skipFirst as T;
}

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
