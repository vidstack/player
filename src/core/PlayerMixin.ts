import { UpdatingElement } from 'lit-element';

import { Constructor } from '../shared';
import { DeviceObserverCocktail, DeviceObserverMixin } from './device';
import {
  AspectRatioCocktail,
  AspectRatioMixin,
  MediaTypeCocktail,
  MediaTypeMixin,
  PlayerContextCocktail,
  PlayerContextMixin,
  ViewTypeCocktail,
  ViewTypeMixin,
} from './mixins';
import { UuidCocktail, UuidMixin } from './uuid';

export type PlayerMixinBase = Constructor<UpdatingElement>;

export type PlayerCocktail<T extends PlayerMixinBase> = T &
  PlayerContextCocktail<T> &
  DeviceObserverCocktail<T> &
  ViewTypeCocktail<T> &
  MediaTypeCocktail<T> &
  UuidCocktail<T> &
  AspectRatioCocktail<ViewTypeCocktail<T>>;

/**
 * Composite mixin that mixes in all player required mixins.
 *
 * @param Base - the constructor to mix into.
 */
export function PlayerMixin<T extends PlayerMixinBase>(
  Base: T,
): PlayerCocktail<T> {
  return class PlayerMixin extends PlayerContextMixin(
    DeviceObserverMixin(
      AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
    ),
  ) {};
}
