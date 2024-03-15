import { Component, computed, effect, prop, provideContext, signal } from 'maverick.js';
import { isBoolean } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaPlayerQuery } from '../../../core/api/player-state';
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
      'data-sm': () => (this._smallWhen() ? '' : null),
      'data-lg': () => (!this._smallWhen() ? '' : null),
      'data-size': () => (this._smallWhen() ? 'sm' : 'lg'),
      'data-no-scrub-gesture': this.$props.noScrubGesture,
    });

    const self = this;
    provideContext(defaultLayoutContext, {
      ...this.$props,
      when: this._when,
      smallWhen: this._smallWhen,
      userPrefersAnnouncements: signal(true),
      userPrefersKeyboardAnimations: signal(true),
      get menuContainer() {
        return self.menuContainer;
      },
    });
  }

  protected override onAttach(): void {
    effect(this._watchColorScheme.bind(this));
  }

  private _watchColorScheme() {
    const { colorScheme } = this.$props;
    this.el?.classList.toggle('light', colorScheme() === 'light');
  }

  protected _matches(query: 'never' | boolean | MediaPlayerQuery) {
    return (
      query !== 'never' &&
      (isBoolean(query) ? query : computed(() => query(this._media.player.state))())
    );
  }
}
