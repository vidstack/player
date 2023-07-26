export function inBounds(el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function hasAnimation(el: HTMLElement): boolean {
  const styles = getComputedStyle(el);
  return styles.animationName !== 'none';
}
