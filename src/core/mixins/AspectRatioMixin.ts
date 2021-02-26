import { listen } from '@wcom/events';
import { property, UpdatingElement } from 'lit-element';
import { MediaProvider } from '../provider/MediaProvider';
import { buildVdsEvent, Constructor } from '../../shared';
import { isUndefined } from '../../utils';
import { PlayerState } from '../player.types';

export type AspectRatioMixinBase = Constructor<
  UpdatingElement & {
    currentProvider?: MediaProvider;
    readonly isVideoView: PlayerState['isVideoView'];
  }
>;

export type AspectRatioCocktail<T extends AspectRatioMixinBase> = T &
  Constructor<
    Pick<PlayerState, 'aspectRatio'> & {
      calcAspectRatio(): number;
      getAspectRatioPadding(): string;
    }
  >;

export class AspectRatioChangeEvent extends buildVdsEvent<
  PlayerState['aspectRatio'],
  'aspect-ratio-change'
>('aspect-ratio-change') {}

/**
 * Mixes in an aspect ratio prop/attr and some helper methods for calculating the current
 * ratio.
 *
 * @param Base - The constructor to mix into.
 */
export function AspectRatioMixin<T extends AspectRatioMixinBase>(
  Base: T,
): AspectRatioCocktail<T> {
  class AspectRatioMixin extends Base {
    protected _aspectRatio = '16:9';

    @property({ attribute: 'aspect-ratio' })
    get aspectRatio() {
      return this._aspectRatio;
    }

    set aspectRatio(newAspectRatio: PlayerState['aspectRatio']) {
      this._aspectRatio = newAspectRatio;

      this.dispatchEvent(
        new AspectRatioChangeEvent({ detail: newAspectRatio }),
      );

      // TODO: this will end up firing the event twice (player then provider).
      if (!isUndefined(this.currentProvider)) {
        this.currentProvider.aspectRatio = this._aspectRatio;
      }
    }

    calcAspectRatio(): number {
      const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
        ? this.aspectRatio.split(':')
        : [16, 9];

      return (100 / Number(width)) * Number(height);
    }

    getAspectRatioPadding(): string {
      return this.isVideoView ? `min(98vh, ${this.calcAspectRatio()}%)` : '';
    }

    @listen(AspectRatioChangeEvent.TYPE)
    protected handleAspectRatioChange(e: AspectRatioChangeEvent) {
      this._aspectRatio = e.detail;
    }
  }

  return AspectRatioMixin;
}
