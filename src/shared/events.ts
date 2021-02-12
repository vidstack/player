import { LIB_PREFIX } from './constants';

export interface VdsEventInit<DetailType, OriginalEventType>
  extends CustomEventInit<DetailType> {
  originalEvent?: OriginalEventType;
}

export interface VdsCustomEventConstructor<DetailType, OriginalEventType> {
  TYPE: string;

  new (eventInit: VdsEventInit<DetailType, OriginalEventType>): VdsCustomEvent<
    DetailType,
    OriginalEventType
  >;
}

export abstract class VdsCustomEvent<
  DetailType,
  OriginalEventType
> extends CustomEvent<DetailType> {
  static TYPE: string;

  originalEvent?: OriginalEventType;

  constructor(
    type: string,
    eventInit?: VdsEventInit<DetailType, OriginalEventType>,
  ) {
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function buildVdsEvent<DetailType>(type: string) {
  return class VdsEvent<OriginalEventType = unknown> extends VdsCustomEvent<
    DetailType,
    OriginalEventType
  > {
    static TYPE = `${LIB_PREFIX}-${type}`;

    constructor(eventInit?: VdsEventInit<DetailType, OriginalEventType>) {
      super(VdsEvent.TYPE, eventInit);
    }
  };
}
