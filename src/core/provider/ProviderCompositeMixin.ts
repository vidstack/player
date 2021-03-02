import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared/types';
import {
  AspectRatioCocktail,
  AspectRatioMixin,
} from '../mixins/AspectRatioMixin';
import { MediaTypeCocktail, MediaTypeMixin } from '../mixins/MediaTypeMixin';
import { RequestCocktail, RequestMixin } from '../mixins/RequestMixin';
import { ViewTypeCocktail, ViewTypeMixin } from '../mixins/ViewTypeMixin';
import { UuidCocktail, UuidMixin } from '../uuid/UuidMixin';

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
  class ProviderCompositeMixin extends RequestMixin(
    AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
  ) {}

  return ProviderCompositeMixin;
}
