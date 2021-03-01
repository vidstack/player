import { UpdatingElement } from 'lit-element';

import { Constructor } from '../shared';
import { DeviceObserverCocktail, DeviceObserverMixin } from './device';
import {
  AspectRatioCocktail,
  AspectRatioMixin,
  ContextCocktail,
  ContextMixin,
  MediaTypeCocktail,
  MediaTypeMixin,
  RequestCocktail,
  RequestMixin,
  ViewTypeCocktail,
  ViewTypeMixin,
} from './mixins';
import { UuidCocktail, UuidMixin } from './uuid';

export type PlayerCompositeMixinBase = Constructor<UpdatingElement>;

export type PlayerCompositeCocktail<T extends PlayerCompositeMixinBase> = T &
  ContextCocktail<T> &
  DeviceObserverCocktail<T> &
  ViewTypeCocktail<T> &
  MediaTypeCocktail<T> &
  UuidCocktail<T> &
  AspectRatioCocktail<ViewTypeCocktail<T>> &
  RequestCocktail<T>;

/**
 * Composite mixin that mixes in all player required mixins.
 *
 * @param Base - the constructor to mix into.
 */
export function PlayerCompositeMixin<T extends PlayerCompositeMixinBase>(
  Base: T,
): PlayerCompositeCocktail<T> {
  class PlayerCompositeMixin extends ContextMixin(
    RequestMixin(
      DeviceObserverMixin(
        AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
      ),
    ),
  ) {}

  return PlayerCompositeMixin;
}
