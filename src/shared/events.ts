import { LIB_PREFIX } from './constants';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
  readonly originalEvent?: unknown;
}

export interface VdsCustomEventConstructor<
  DetailType,
  Type extends string = string
> {
  readonly TYPE: Type;

  new (eventInit?: VdsEventInit<DetailType>): VdsCustomEvent<DetailType, Type>;
}

export abstract class VdsCustomEvent<
  DetailType,
  Type extends string = string
> extends CustomEvent<DetailType> {
  static readonly TYPE: string;

  readonly type!: Type;

  readonly originalEvent?: unknown;

  constructor(type: string, eventInit?: VdsEventInit<DetailType>) {
    const { originalEvent, ...init } = eventInit ?? {};

    super(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    });

    this.originalEvent = originalEvent;
  }
}

export function buildVdsEvent<
  DetailType,
  Type extends string,
  NamespacedType extends string = `${typeof LIB_PREFIX}-${Type}`
>(type: Type): VdsCustomEventConstructor<DetailType, NamespacedType> {
  return class VdsEvent extends VdsCustomEvent<DetailType, NamespacedType> {
    static readonly TYPE = `${LIB_PREFIX}-${type}` as NamespacedType;

    constructor(eventInit?: VdsEventInit<DetailType>) {
      super(VdsEvent.TYPE, eventInit);
    }
  };
}
