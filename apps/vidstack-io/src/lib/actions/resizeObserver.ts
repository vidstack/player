export function resizeObserver(
  node: Element,
  options: ResizeObserverOptions & {
    callback: ResizeObserverCallback;
  },
): SvelteActionReturnType {
  const observer = new ResizeObserver(options.callback);

  observer.observe(node, options);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
