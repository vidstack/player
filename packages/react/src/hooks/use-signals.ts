import * as React from 'react';

import { computed, effect, scoped, signal, type MaybeStopEffect } from 'maverick.js';
import { useReactScope } from 'maverick.js/react';

export function createSignal<T>(initialValue: T, deps: any[] = []) {
  const scope = useReactScope();
  return React.useMemo(() => scoped(() => signal(initialValue), scope)!, [scope, ...deps]);
}

export function createComputed<T>(compute: () => T, deps: any[] = []) {
  const scope = useReactScope();
  return React.useMemo(() => scoped(() => computed(compute), scope)!, [scope, ...deps]);
}

export function createEffect(compute: () => MaybeStopEffect, deps: any[] = []) {
  const scope = useReactScope();
  React.useEffect(() => scoped(() => effect(compute), scope)!, [scope, ...deps]);
}

export function useScoped<T>(compute: () => T) {
  const scope = useReactScope();
  return React.useMemo(() => scoped(compute, scope)!, [scope]);
}
