import { AnyRecord, effect, signal, Store } from 'maverick.js';
import { noop } from 'maverick.js/std';
import { useEffect, useMemo, useRef, useState } from 'react';

export function useStore<
  Record extends AnyRecord,
  Create extends Store<Record>,
  StoreRecord extends Record,
>(store: Create, $store?: StoreRecord | null): Record {
  const [_, update] = useState(0),
    tracking = useRef({
      $props: signal<(keyof Record)[]>([]),
      observing: new Set<keyof Record>(),
    });

  useEffect(() => {
    if (!$store) return;
    return effect(() => {
      const props = tracking.current.$props();
      for (let i = 0; i < props.length; i++) $store[props[i]];
      update((n) => n + 1);
    });
  }, [$store]);

  return useMemo(() => {
    if (!$store) return store.initial;
    const { observing, $props } = tracking.current;
    return new Proxy($store, {
      get(_, prop: any) {
        if (!observing.has(prop)) {
          $props.set((prev) => [...prev, prop]);
          observing.add(prop);
        }

        return $store[prop];
      },
      // @ts-expect-error
      set: noop,
    });
  }, [$store]);
}
