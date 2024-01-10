import { Component, prop, provideContext } from 'maverick.js';

import { PlayerQueryList } from '../../../core';
import { defaultLayoutContext } from './context';
import { defaultLayoutProps, type DefaultLayoutProps } from './props';

export class DefaultLayout extends Component<DefaultLayoutProps> {
  static props = defaultLayoutProps;

  // slider-chapters-min-width

  private _whenQueryList!: PlayerQueryList;
  private _whenSmQueryList!: PlayerQueryList;

  @prop
  menuContainer: HTMLElement | null = null;

  @prop
  get isMatch() {
    return this._whenQueryList.matches;
  }

  @prop
  get isSmallLayout() {
    return this._whenSmQueryList.matches;
  }

  protected override onSetup(): void {
    const {
      when,
      smallWhen,
      thumbnails,
      translations,
      menuGroup,
      noModal,
      sliderChaptersMinWidth,
      disableTimeSlider,
      noGestures,
      noKeyboardActionDisplay,
    } = this.$props;

    this._whenQueryList = PlayerQueryList.create(when);
    this._whenSmQueryList = PlayerQueryList.create(smallWhen);

    this.setAttributes({
      'data-match': this._whenQueryList.$matches,
      'data-size': () => (this._whenSmQueryList.matches ? 'sm' : null),
    });

    const self = this;
    provideContext(defaultLayoutContext, {
      smQueryList: this._whenSmQueryList,
      thumbnails,
      translations,
      menuGroup,
      noModal,
      sliderChaptersMinWidth,
      disableTimeSlider,
      noGestures,
      noKeyboardActionDisplay,
      get menuContainer() {
        return self.menuContainer;
      },
    });
  }
}
