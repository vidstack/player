import type { FileDownloadInfo } from '../../../utils/network';
import type { ThumbnailSrc } from '../../ui/thumbnails/thumbnail-loader';
import type { PlyrLayoutTranslations } from './translations';

export const plyrLayoutProps: PlyrLayoutProps = {
  clickToPlay: true,
  clickToFullscreen: true,
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute+volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
  customIcons: false,
  displayDuration: false,
  download: null,
  markers: null,
  invertTime: true,
  thumbnails: null,
  toggleTime: true,
  translations: null,
  seekTime: 10,
  speed: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4],
};

export interface PlyrLayoutProps {
  /**
   * Press the video container to toggle play/pause.
   */
  clickToPlay: boolean;
  /**
   * Double-press the video container to toggle fullscreen.
   */
  clickToFullscreen: boolean;
  /**
   * The controls to be included in the layout and their order specified by the position in the
   * array.
   */
  controls: PlyrControl[];
  /**
   * Whether the default icons should _not_ be loaded. Set this to `true` when providing your own
   * icons.
   */
  customIcons: boolean;
  /**
   * Whether the duration should be displayed. This is ignored if `toggleTime` is `true`.
   */
  displayDuration: boolean;
  /**
   * Sets the download URL and filename for the download button. The download button must be
   * included in the `controls` prop for this to take effect.
   */
  download: FileDownloadInfo;
  /**
   * Points on the time slider which should be visually marked for the user.
   */
  markers: PlyrMarker[] | null;
  /**
   * Display the current time as a countdown rather than an incremental counter.
   */
  invertTime: boolean;
  /**
   * The thumbnails resource.
   *
   * @see {@link https://www.vidstack.io/docs/wc/player/core-concepts/loading#thumbnails}
   */
  thumbnails: ThumbnailSrc;
  /**
   * Allow users to press to toggle the inverted time.
   */
  toggleTime: boolean;
  /**
   * Translation map from english to your desired language for words used throughout the layout.
   */
  translations: Partial<PlyrLayoutTranslations> | null;
  /**
   * The time, in seconds, to seek when a user hits fast forward or rewind.
   */
  seekTime: number;
  /**
   * The speed options to display in the UI.
   */
  speed: (string | number)[];
}

export type PlyrControl =
  | 'airplay'
  | 'captions'
  | 'current-time'
  | 'download'
  | 'duration'
  | 'fast-forward'
  | 'fullscreen'
  | 'mute'
  | 'mute+volume'
  | 'pip'
  | 'play-large'
  | 'play'
  | 'progress'
  | 'restart'
  | 'rewind'
  | 'settings'
  | 'volume';

export interface PlyrMarker {
  time: number;
  label: string;
}
