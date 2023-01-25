import {
  type MediaOrientationChangeEvent,
  type ScreenOrientationLockType,
  type ScreenOrientationType,
} from 'vidstack';

const media = document.querySelector('vds-media');

media.addEventListener('orientation-change', (event: MediaOrientationChangeEvent) => {
  const { orientation, lock } = event.detail;
});
