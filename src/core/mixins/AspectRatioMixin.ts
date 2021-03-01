import { event, listen } from '@wcom/events';
import { property, UpdatingElement } from 'lit-element';

import { buildVdsEvent, Constructor } from '../../shared';
import { isUndefined } from '../../utils';
import { PlayerState } from '../player.types';
import { MediaProvider } from '../provider/MediaProvider';

export type AspectRatioMixinBase = Constructor<
  UpdatingElement & {
    currentProvider?: MediaProvider;
  }
>;

export type AspectRatioCocktail<T extends AspectRatioMixinBase> = T &
  Constructor<
    Pick<PlayerState, 'aspectRatio'> & {
      calcAspectRatio(): number;
      getAspectRatioPadding(minPadding?: string): string;
    }
  >;

export class AspectRatioChangeEvent extends buildVdsEvent<
  PlayerState['aspectRatio']
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

    /**
     * Emitted when the aspect ratio changes.
     */
    @event({ name: 'vds-aspect-ratio-change' })
    protected AspectRatioChangeEvent!: AspectRatioChangeEvent;

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

      this.requestUpdate();
    }

    calcAspectRatio(): number {
      const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
        ? this.aspectRatio.split(':')
        : [16, 9];

      return (100 / Number(width)) * Number(height);
    }

    getAspectRatioPadding(minPadding = '98vh'): string {
      return `min(${minPadding}, ${this.calcAspectRatio()}%)`;
    }

    @listen(AspectRatioChangeEvent.TYPE)
    protected handleAspectRatioChange(e: AspectRatioChangeEvent) {
      this._aspectRatio = e.detail;
    }
  }

  return AspectRatioMixin;
}
