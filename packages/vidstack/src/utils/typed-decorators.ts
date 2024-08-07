import { method as _method, prop as _prop } from 'maverick.js';

export function declare_props<T>(ctor: { new (): T }, names: Array<keyof T>) {
  const proto = ctor.prototype;
  for (const name of names) _prop(proto, name as string);
}

export function declare_methods<T>(ctor: { new (): T }, names: Array<keyof T>) {
  const proto = ctor.prototype;
  // @ts-expect-error - no descriptor
  for (const name of names) _method(proto, name as string);
}
