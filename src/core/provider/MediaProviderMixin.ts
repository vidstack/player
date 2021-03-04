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
import { MediaTypeCocktail, MediaTypeMixin } from '../mixins/MediaTypeMixin';
import {
  PlayerContextCocktail,
  PlayerContextMixin,
} from '../mixins/PlayerContextMixin';
import { RequestCocktail, RequestMixin } from '../mixins/RequestMixin';
import { ViewTypeCocktail, ViewTypeMixin } from '../mixins/ViewTypeMixin';
import { UuidCocktail, UuidMixin } from '../uuid/UuidMixin';

export type MediaProviderMixinBase = Constructor<UpdatingElement>;

export type MediaProviderCocktail<T extends MediaProviderMixinBase> = T &
  PlayerContextCocktail<T> &
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
    PlayerContextMixin(
      RequestMixin(
        AspectRatioMixin(ViewTypeMixin(MediaTypeMixin(UuidMixin(Base)))),
      ),
    ),
  ) {}

  return MediaProviderMixin;
}
