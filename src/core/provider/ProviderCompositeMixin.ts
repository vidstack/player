import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared';
import {
  AspectRatioCocktail,
  AspectRatioMixin,
  MediaTypeCocktail,
  MediaTypeMixin,
  RequestCocktail,
  RequestMixin,
  ViewTypeCocktail,
  ViewTypeMixin,
} from '../mixins';
import { UuidCocktail, UuidMixin } from '../uuid';

export type ProviderCompositeMixinBase = Constructor<UpdatingElement>;

export type ProviderCompositeCocktail<
  T extends ProviderCompositeMixinBase
> = T &
  ViewTypeCocktail<T> &
  MediaTypeCocktail<T> &
  UuidCocktail<T> &
  AspectRatioCocktail<ViewTypeCocktail<T>> &
  RequestCocktail<T>;

/**
 * Composite mixin that mixes in all provider required mixins.
 *
 * @param Base - the constructor to mix into.
 */
export function ProviderCompositeMixin<T extends ProviderCompositeMixinBase>(
  Base: T,
): ProviderCompositeCocktail<T> {
  class ProviderMixin extends RequestMixin(
    AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
  ) {}

  return ProviderMixin;
}
