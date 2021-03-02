import { UpdatingElement } from 'lit-element';

import { Constructor } from '../../shared/types';
import {
  DeviceObserverCocktail,
  DeviceObserverMixin,
} from '../device/DeviceObserverMixin';
import {
  AspectRatioCocktail,
  AspectRatioMixin,
} from '../mixins/AspectRatioMixin';
import { ContextCocktail, ContextMixin } from '../mixins/ContextMixin';
import { MediaTypeCocktail, MediaTypeMixin } from '../mixins/MediaTypeMixin';
import { RequestCocktail, RequestMixin } from '../mixins/RequestMixin';
import { ViewTypeCocktail, ViewTypeMixin } from '../mixins/ViewTypeMixin';
import { UuidCocktail, UuidMixin } from '../uuid/UuidMixin';

export type MediaProviderMixinBase = Constructor<UpdatingElement>;

export type MediaProviderCocktail<T extends MediaProviderMixinBase> = T &
  ContextCocktail<T> &
  DeviceObserverCocktail<T> &
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
export function MediaProviderMixin<T extends MediaProviderMixinBase>(
  Base: T,
): MediaProviderCocktail<T> {
  class MediaProviderMixin extends DeviceObserverMixin(
    ContextMixin(
      RequestMixin(
        AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
      ),
    ),
  ) {}

  return MediaProviderMixin;
}
