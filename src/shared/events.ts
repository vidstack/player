import { LIB_PREFIX } from './constants';

export interface VdsEventInit<OriginalEventType> extends EventInit {
  originalEvent: OriginalEventType;
}

export interface VdsCustomEventConstructor<DetailType, OriginalEventType> {
  TYPE: string;

  new (
    type: string,
    eventInit: VdsEventInit<OriginalEventType>,
  ): VdsCustomEvent<DetailType, OriginalEventType>;
}

export abstract class VdsCustomEvent<
  DetailType,
  OriginalEventType
> extends CustomEvent<DetailType> {
  static TYPE: string;

  originalEvent: OriginalEventType;

  constructor(type: string, eventInit: VdsEventInit<OriginalEventType>) {
    const { originalEvent, ...init } = eventInit;

    super(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    });

    this.originalEvent = originalEvent;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function buildVdsEvent<DetailType>(type: string) {
  return class VdsEvent<OriginalEventType = void> extends VdsCustomEvent<
    DetailType,
    OriginalEventType
  > {
    static TYPE = `${LIB_PREFIX}-${type}`;
  };
}
