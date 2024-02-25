import type { MediaPlayerQuery } from '../../../core/api/player-state';
import { DEFAULT_AUDIO_GAINS } from '../../ui/menu/radio-groups/audio-gain-radio-group';
import { DEFAULT_PLAYBACK_RATES } from '../../ui/menu/radio-groups/speed-radio-group';
import type { ThumbnailSrc } from '../../ui/thumbnails/thumbnail-loader';
import type { DefaultLayoutTranslations } from './translations';

export const defaultLayoutProps: DefaultLayoutProps = {
  customIcons: false,
  disableTimeSlider: false,
  menuGroup: 'bottom',
  noAudioGainSlider: false,
  maxAudioGain: 300,
  noGestures: false,
  noKeyboardAnimations: false,
  noModal: false,
  noScrubGesture: false,
  playbackRates: DEFAULT_PLAYBACK_RATES,
  audioGains: DEFAULT_AUDIO_GAINS,
  seekStep: 10,
  sliderChaptersMinWidth: 325,
  smallWhen: false,
  thumbnails: null,
  translations: null,
  when: false,
};

export interface DefaultLayoutProps {
  /**
   * Determines when the UI should be displayed.
   */
  when: boolean | MediaPlayerQuery;
  /**
   * Determines when the small (e.g., mobile) UI should be displayed.
   */
  smallWhen: 'never' | boolean | MediaPlayerQuery;
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
   * Disable audio boost slider in the settings menu.
   */
  noAudioGainSlider: boolean;
  /**
   * The maximum audio gain to be applied. The default is `300` which represents a `300%` boost.
   */
  maxAudioGain: number;
  /**
   * Whether modal menus should be disabled when the small layout is active. A modal menu is
   * a floating panel that floats up from the bottom of the screen (outside of the player). It's
   * enabled by default as it provides a better user experience for touch devices.
   */
  noModal: boolean;
  /**
   * Whether to disable scrubbing by touch swiping left or right on the player canvas.
   */
  noScrubGesture: boolean;
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
  noKeyboardAnimations: boolean;
  /**
   * The playback rate options to be displayed in the settings menu.
   */
  playbackRates: number[];

  /**
   * The audio gain options to be displayed in the settings menu.
   */
  audioGains: number[];
  /**
   * The number of seconds to seek forward or backward when pressing the seek button or using
   * keyboard shortcuts.
   */
  seekStep: number;
}
