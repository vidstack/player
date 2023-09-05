export function mergeFunctions(...fns: (() => void)[]) {
  return () => {
    for (const fn of fns) fn();
  };
}
