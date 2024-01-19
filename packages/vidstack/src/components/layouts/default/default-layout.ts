import { Component, computed, prop, provideContext } from 'maverick.js';
import { isBoolean } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaPlayerQueryCallback } from '../../../core/api/player-state';
import { defaultLayoutContext } from './context';
import { defaultLayoutProps, type DefaultLayoutProps } from './props';

export class DefaultLayout extends Component<DefaultLayoutProps> {
  static props = defaultLayoutProps;

  protected _media!: MediaContext;

  protected _when = computed(() => {
    const when = this.$props.when();
    return this._matches(when);
  });

  protected _smallWhen = computed(() => {
    const when = this.$props.smallWhen();
    return this._matches(when);
  });

  @prop
  menuContainer: HTMLElement | null = null;

  @prop
  get isMatch() {
    return this._when();
  }

  @prop
  get isSmallLayout() {
    return this._smallWhen();
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    this.setAttributes({
      'data-match': this._when,
      'data-size': () => (this._smallWhen() ? 'sm' : null),
    });

    const self = this;
    provideContext(defaultLayoutContext, {
      ...this.$props,
      when: this._when,
      smallWhen: this._smallWhen,
      get menuContainer() {
        return self.menuContainer;
      },
    });
  }

  protected _matches(query: boolean | MediaPlayerQueryCallback) {
    return isBoolean(query) ? query : computed(() => query(this._media.player.state))();
  }
}
