import { v4 as uuid } from '@lukeed/uuid';
import { UpdatingElement } from 'lit-element';
import { Constructor } from '../../shared';
import { uuidContext } from './uuid.context';

export type UuidMixinBase = Constructor<UpdatingElement>;

export type UuidCocktail<T extends UuidMixinBase> = T &
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
export function UuidMixin<T extends UuidMixinBase>(Base: T): UuidCocktail<T> {
  class UuidMixin extends Base {
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

  return UuidMixin;
}
