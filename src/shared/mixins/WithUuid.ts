import { v4 as uuid } from '@lukeed/uuid';
import createContext from '@wcom/context';
import { ReactiveElement } from 'lit';

import { Constructor } from '../types';

export const uuidContext = createContext('');

export type WithUuidBase = Constructor<ReactiveElement>;

export type WithUuidCocktail<T extends WithUuidBase> = T &
  Constructor<{
    /**
     * Randomly generated version 4 [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) UUID which can
     * be used to identify a component.
     */
    readonly uuid: string;
  }>;

/**
 * Mixes in a uuid attribute, property, and context that can uniquely identify a component.
 *
 * @param Base - The constructor to mix into.
 */
export function WithUuid<T extends WithUuidBase>(Base: T): WithUuidCocktail<T> {
  class WithUuid extends Base {
    protected _uuid = uuid();

    @uuidContext.provide()
    protected uuidCtx = uuidContext.defaultValue;

    get uuid(): string {
      return this._uuid;
    }

    connectedCallback(): void {
      this.setUuid();
      super.connectedCallback();
    }

    protected setUuid(): void {
      this.uuidCtx = this.uuid;
      this.setAttribute('uuid', this.uuid);
    }
  }

  return WithUuid;
}
