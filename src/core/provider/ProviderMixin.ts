import { UpdatingElement } from 'lit-element';
import { Constructor } from '../../shared';
import {
  MediaTypeCocktail,
  MediaTypeMixin,
  AspectRatioCocktail,
  ViewTypeCocktail,
  ViewTypeMixin,
  AspectRatioMixin,
} from '../mixins';
import { UuidMixin } from '../uuid';

export type ProviderMixinBase = Constructor<UpdatingElement>;

export type ProviderCocktail<T extends ProviderMixinBase> = T &
  ViewTypeCocktail<T> &
  MediaTypeCocktail<T> &
  AspectRatioCocktail<ViewTypeCocktail<T>>;

/**
 * Composite mixin that mixes in all provider required mixins.
 *
 * @param Base - the constructor to mix into.
 */
export function ProviderMixin<T extends ProviderMixinBase>(
  Base: T,
): ProviderCocktail<T> {
  return class ProviderMixin extends AspectRatioMixin(
    ViewTypeMixin(MediaTypeMixin(UuidMixin(Base))),
  ) {};
}
