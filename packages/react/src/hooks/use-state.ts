import * as React from 'react';

import type { AnyRecord, Component, State } from 'maverick.js';
import { useSignal, useSignalRecord } from 'maverick.js/react';

/**
 * This hook is used to subscribe to specific state on a component instance.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-state}
 */
export function useState<T extends AnyRecord, R extends keyof T>(
  ctor: { state: State<T> },
  prop: R,
  ref: React.RefObject<Component<any, T, any, any> | null>,
): T[R] {
  const initialValue = React.useMemo(() => ctor.state.record[prop], [ctor, prop]);
  return useSignal(ref.current ? ref.current.$state[prop] : initialValue);
}

const storesCache = new Map<any, any>();

/**
 * This hook is used to subscribe to multiple states on a component instance.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-store}
 */
export function useStore<T extends AnyRecord>(
  ctor: { state: State<T> },
  ref: React.RefObject<Component<any, T, any, any> | null>,
): T {
  const initialStore = React.useMemo<any>(() => {
    let store = storesCache.get(ctor);

    // Share the same initial store proxy across constructors.
    if (!store) {
      store = new Proxy(ctor.state.record, {
        get: (_, prop: any) => () => ctor.state.record[prop],
      });

      storesCache.set(ctor, store);
    }

    return store;
  }, [ctor]);

  return useSignalRecord(ref.current ? ref.current.$state : initialStore);
}
