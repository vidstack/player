/* eslint-disable @typescript-eslint/ban-types */

import { kebabToCamelCase } from '@vidstack/foundation';
import {
  append_hydration,
  assign,
  attr,
  binding_callbacks,
  children,
  create_slot,
  detach,
  element,
  exclude_internal_props,
  get_all_dirty_from_scope,
  get_slot_changes,
  get_spread_update,
  init,
  insert_hydration,
  listen,
  noop,
  safe_not_equal,
  SvelteComponent,
  tick,
  transition_in,
  transition_out,
  update_slot_base,
} from 'svelte/internal';

function init_claim_info(nodes: any) {
  if (nodes.claim_info === undefined) {
    nodes.claim_info = { last_index: 0, total_claimed: 0 };
  }
}

function set_prop(node: Element, prop: string, value: any) {
  node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
}

function set_custom_element_data(node: Element, props: Record<string, any>) {
  if (!props) return;

  for (const prop in props) {
    const value = props[prop];

    if (prop in node) {
      set_prop(node, prop, value);
      continue;
    }

    if (prop.includes('-')) {
      const camel_case_prop = kebabToCamelCase(prop);
      if (camel_case_prop in node) {
        set_prop(node, camel_case_prop, value);
        continue;
      }
    }

    attr(node, prop, value);
  }
}

function claim_custom_element(nodes: any, tag_name: keyof HTMLElementTagNameMap) {
  init_claim_info(nodes);

  const node_name = tag_name.toUpperCase();
  const predicate = (node: Node) => node.nodeName === node_name;

  const resultNode = (() => {
    for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
      const node = nodes[i];

      if (predicate(node)) {
        nodes.splice(i, 1);
        nodes.claim_info.last_index = i;
        return node;
      }
    }

    for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
      const node = nodes[i];

      if (predicate(node)) {
        nodes.splice(i, 1);
        nodes.claim_info.last_index = i;

        return node;
      }
    }

    return element(tag_name);
  })();

  resultNode.claim_order = nodes.claim_info.total_claimed;
  nodes.claim_info.total_claimed += 1;
  return resultNode;
}

export function createComponent(tag_name: keyof HTMLElementTagNameMap): typeof SvelteComponent {
  function create_fragment(ctx: any) {
    let current;
    let custom_element: Element;

    const default_slot_template = /*#slots*/ ctx[2].default;
    const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    const custom_element_levels = [/*$$props*/ ctx[0]];

    let custom_element_data = {};

    for (let i = 0; i < custom_element_levels.length; i += 1) {
      custom_element_data = assign(custom_element_data, custom_element_levels[i]);
    }

    return {
      c() {
        custom_element = element(tag_name);
        if (default_slot) default_slot.c();
        this.h();
      },
      l(nodes) {
        custom_element = claim_custom_element(nodes, tag_name);
        const custom_element_nodes = children(custom_element);
        if (default_slot) default_slot.l(custom_element_nodes);
        custom_element_nodes.forEach(detach);
        this.h();
      },
      h() {
        set_custom_element_data(custom_element, custom_element_data);
      },
      m(target, anchor) {
        if (target.children.length === 1 || anchor) {
          insert_hydration(target, custom_element, anchor);
        } else {
          append_hydration(target, custom_element);
        }

        /*custom_element_binding*/ ctx[4](custom_element);

        if (default_slot) {
          default_slot.m(custom_element, null);
        }

        current = true;
      },
      p(ctx, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[1],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
                : get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
              null,
            );
          }
        }

        set_custom_element_data(
          custom_element,
          (custom_element_data = get_spread_update(custom_element_levels, [
            dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
          ])),
        );
      },
      i(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) detach(custom_element);
        /*custom_element_binding*/ ctx[4](null);
        if (default_slot) default_slot.d(detaching);
      },
    };
  }

  function instance($$self, $$props, $$invalidate) {
    // eslint-disable-next-line prefer-const
    let { $$slots: slots = {}, $$scope } = $$props;

    let custom_element;

    function custom_element_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        custom_element = $$value;
        $$invalidate(3, custom_element);
      });
    }

    $$self.$$set = ($$new_props) => {
      $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
      $$invalidate(0, $$props);
      if ('$$scope' in $$new_props) $$invalidate(1, ($$scope = $$new_props.$$scope));
    };

    return [
      exclude_internal_props($$props),
      $$scope,
      slots,
      custom_element,
      custom_element_binding,
    ];
  }

  // @ts-expect-error
  return class CustomElement extends SvelteComponent {
    constructor(options) {
      super();

      this.$set = ($$new_props) => {
        if (!this.element) return;
        set_custom_element_data(this.element, exclude_internal_props($$new_props));
      };

      const dispose: (() => void)[] = [];
      this.$on = (type, callback) => {
        let off;

        const addListener = () => {
          if (!this.element) return;
          off = listen(this.element, type, callback);
          dispose.push(off);
        };

        if (!this.element) {
          tick().then(addListener);
        } else {
          addListener();
        }

        return () => {
          off?.();
        };
      };

      this.$destroy = () => {
        dispose.forEach((off) => off());
        return super.$destroy();
      };

      // @ts-expect-error
      init(this, options, instance, create_fragment, safe_not_equal, { element: 3 });
    }

    get element() {
      return this.$$.ctx[3];
    }
  };
}
