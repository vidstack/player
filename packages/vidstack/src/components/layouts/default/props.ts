import type { MediaPlayerQuery } from '../../../core/api/player-state';
import type { ThumbnailSrc } from '../../ui/thumbnails/thumbnail-loader';
import type { DefaultLayoutTranslations } from './translations';

export const defaultLayoutProps: DefaultLayoutProps = {
  when: false,
  smallWhen: false,
  thumbnails: null,
  customIcons: false,
  translations: null,
  menuGroup: 'bottom',
  noModal: false,
  sliderChaptersMinWidth: 325,
  disableTimeSlider: false,
  noGestures: false,
  noKeyboardActionDisplay: false,
};

export interface DefaultLayoutProps {
  /**
   * Determines when the UI should be displayed.
   */
  when: boolean | MediaPlayerQuery;
  /**
   * Determines when the small (e.g., mobile) UI should be displayed.
   */
  smallWhen: boolean | MediaPlayerQuery;
  /**
   * The thumbnails resource.
   *
   * @see {@link https://www.vidstack.io/docs/wc/player/core-concepts/loading#thumbnails}
   */
  thumbnails: ThumbnailSrc;
  /**
   * Whether the default icons should _not_ be loaded. Set this to `true` when providing your own
   * icons.
   */
  customIcons: boolean;
  /**
   * Translation map from english to your desired language for words used throughout the layout.
   */
  translations: Partial<DefaultLayoutTranslations> | null;
  /**
   * Specifies whether menu buttons should be placed in the top or bottom controls group. This
   * only applies to the large video layout.
   */
  menuGroup: 'top' | 'bottom';
  /**
   * Whether modal menus should be disabled when the small layout is active. A modal menu is
   * a floating panel that floats up from the bottom of the screen (outside of the player). It's
   * enabled by default as it provides a better user experience for touch devices.
   */
  noModal: boolean;
  /**
   * The minimum width of the slider to start displaying slider chapters when available.
   */
  sliderChaptersMinWidth: number;
  /**
   * Whether the time slider should be disabled.
   */
  disableTimeSlider: boolean;
  /**
   * Whether all gestures such as press to play or seek should not be active.
   */
  noGestures: boolean;
  /**
   * Whether keyboard actions should not be displayed.
   */
  noKeyboardActionDisplay: boolean;
}
