import { compute_rest_props, create_ssr_component, escape_object, spread } from 'svelte/internal';

export function createComponent(tag_name: string, slots: string[]) {
  return create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    const $$restProps = compute_rest_props($$props, []);
    return `<${tag_name}${spread([escape_object($$restProps)], {})}>${slots.map(
      (slot) => $$slots[slot]?.(slot === 'default' ? {} : { slot }) ?? '',
    )}</${tag_name}>`;
  });
}
