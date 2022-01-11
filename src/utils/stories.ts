/**
 * When properties are spread `<vds-* {...props}>` on a custom element in Svelte, the values
 * are set on attributes instead of properties, this can cause issues with `boolean` types. This
 * action takes the given `props` and sets them as properties on the custom element this is
 * attached to.
 */
export function spreadPropsAction<T extends HTMLElement>(
  node: T,
  props: Partial<Record<keyof T, unknown>>
) {
  function update(props: Partial<Record<keyof T, unknown>>) {
    for (const prop of Object.keys(props)) {
      node[prop] = props[prop];
    }
  }

  update(props);

  return {
    update
  };
}
