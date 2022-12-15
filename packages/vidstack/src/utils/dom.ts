export function setAttributeIfEmpty(target: Element, name: string, value: string) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}
