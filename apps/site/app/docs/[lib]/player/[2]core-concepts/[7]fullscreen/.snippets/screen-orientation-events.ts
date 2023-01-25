import {
  type ScreenOrientationChangeEvent,
  type ScreenOrientationLockType,
  type ScreenOrientationType,
} from 'vidstack';

const media = document.querySelector('vds-media');

media.addEventListener('screen-orientation-change', (event: ScreenOrientationChangeEvent) => {
  const { orientation, lock } = event.detail;
});
