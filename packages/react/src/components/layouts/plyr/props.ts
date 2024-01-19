import type { PlyrLayoutProps as BaseProps } from 'vidstack';

import type { PlyrLayoutSlots } from '.';
import type { PlyrLayoutIcons } from './icons';

export const defaultPlyrLayoutProps: Omit<PlyrLayoutProps, 'icons' | 'slots'> = {
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

export interface PlyrLayoutProps extends Omit<Partial<BaseProps>, 'customIcons'> {
  /**
   * The icons to be rendered and displayed inside the layout.
   */
  icons: PlyrLayoutIcons;
  /**
   * Provide additional content to be inserted in specific positions.
   */
  slots?: PlyrLayoutSlots;
}
