import { Component, computed, prop, provideContext, signal } from 'maverick.js';
import { isBoolean } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaPlayerQuery } from '../../../core/api/player-state';
import { watchColorScheme } from '../../../utils/dom';
import { defaultLayoutContext } from './context';
import { defaultLayoutProps, type DefaultLayoutProps } from './props';

export class DefaultLayout extends Component<DefaultLayoutProps> {
  static props = defaultLayoutProps;

  #media!: MediaContext;

  #when = computed(() => {
    const when = this.$props.when();
    return this.#matches(when);
  });

  #smallWhen = computed(() => {
    const when = this.$props.smallWhen();
    return this.#matches(when);
  });

  @prop
  get isMatch() {
    return this.#when();
  }

  @prop
  get isSmallLayout() {
    return this.#smallWhen();
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    this.setAttributes({
      'data-match': this.#when,
      'data-sm': () => (this.#smallWhen() ? '' : null),
      'data-lg': () => (!this.#smallWhen() ? '' : null),
      'data-size': () => (this.#smallWhen() ? 'sm' : 'lg'),
      'data-no-scrub-gesture': this.$props.noScrubGesture,
    });

    const self = this;
    provideContext(defaultLayoutContext, {
      ...this.$props,
      when: this.#when,
      smallWhen: this.#smallWhen,
      userPrefersAnnouncements: signal(true),
      userPrefersKeyboardAnimations: signal(true),
      menuPortal: signal<HTMLElement | null>(null),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    watchColorScheme(el, this.$props.colorScheme);
  }

  #matches(query: 'never' | boolean | MediaPlayerQuery) {
    return (
      query !== 'never' &&
      (isBoolean(query) ? query : computed(() => query(this.#media.player.state))())
    );
  }
}
