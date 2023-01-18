export function intersectionObserver(
  node: Element,
  options: IntersectionObserverInit & {
    callback: IntersectionObserverCallback;
  },
): SvelteActionReturnType {
  const { callback, ...init } = options;

  const observer = new IntersectionObserver(callback, init);
  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
