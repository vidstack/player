import { event, listen } from '@wcom/events';
import { property, UpdatingElement } from 'lit-element';

import { buildVdsEvent } from '../../shared/events';
import { Constructor } from '../../shared/types';
import { isString } from '../../utils/unit';
import { PlayerProps } from '../player.types';
import { MediaProvider } from '../provider/MediaProvider';

export type AspectRatioMixinBase = Constructor<
  UpdatingElement & {
    currentProvider?: MediaProvider;
  }
>;

export type AspectRatioCocktail<T extends AspectRatioMixinBase> = T &
  Constructor<
    Pick<PlayerProps, 'aspectRatio'> & {
      calcAspectRatio(): number;
      getAspectRatioPadding(minPadding?: string): string;
    }
  >;

export class AspectRatioChangeEvent extends buildVdsEvent<
  PlayerProps['aspectRatio']
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
    protected _aspectRatio?: string;

    /**
     * Emitted when the aspect ratio changes.
     */
    @event({ name: 'vds-aspect-ratio-change' })
    protected AspectRatioChangeEvent!: AspectRatioChangeEvent;

    @property({ attribute: 'aspect-ratio' })
    get aspectRatio() {
      return this._aspectRatio;
    }

    set aspectRatio(newAspectRatio: PlayerProps['aspectRatio']) {
      this._aspectRatio = newAspectRatio;

      this.dispatchEvent(
        new AspectRatioChangeEvent({ detail: newAspectRatio }),
      );

      this.requestUpdate();
    }

    calcAspectRatio(): number {
      if (
        !isString(this.aspectRatio) ||
        !/\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      )
        return NaN;

      const [width, height] = this.aspectRatio.split(':');

      return (100 / Number(width)) * Number(height);
    }

    getAspectRatioPadding(minPadding = '98vh'): string {
      const ratio = this.calcAspectRatio();
      if (isNaN(ratio)) return '';
      return `min(${minPadding}, ${this.calcAspectRatio()}%)`;
    }

    @listen(AspectRatioChangeEvent.TYPE)
    protected handleAspectRatioChange(e: AspectRatioChangeEvent) {
      this._aspectRatio = e.detail;
    }
  }

  return AspectRatioMixin;
}
