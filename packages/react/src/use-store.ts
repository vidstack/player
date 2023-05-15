import { effect, signal, type ReadSignalRecord, type StoreFactory } from 'maverick.js';
import type { HostElement } from 'maverick.js/element';
import { isArray, noop } from 'maverick.js/std';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

export function useStore<Record extends {}>(
  factory: StoreFactory<Record>,
  ref?: RefObject<HostElement | null>,
  init?: ReadSignalRecord<Record>,
): Record {
  const [$store, $setStore] = useState<ReadSignalRecord<Record> | undefined>(init),
    [_, update] = useState(0),
    tracking = useRef({
      $props: signal<(keyof Record)[]>([]),
      observing: new Set<keyof Record>(),
    });

  useEffect(() => {
    const $store = ref?.current?.$store;
    if ($store) $setStore($store);
  }, []);

  useEffect(() => {
    if (!$store) return;
    return effect(() => {
      const props = tracking.current.$props();
      for (let i = 0; i < props.length; i++) $store[props[i]]();
      update((n) => n + 1);
    });
  }, [$store]);

  return useMemo(() => {
    if (!$store) return factory.record;
    const { observing, $props } = tracking.current;
    return new Proxy($store, {
      get(_, prop: keyof Record & string) {
        if (!observing.has(prop)) {
          $props.set((prev) => [...prev, prop]);
          observing.add(prop);
        }

        const value = $store[prop as keyof Record]();
        return isArray(value) ? [...value] : value;
      },
      // @ts-expect-error
      set: noop,
    });
  }, [$store]);
}
