import {
  type MediaOrientationChangeEvent,
  type ScreenOrientationLockType,
  type ScreenOrientationType,
} from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('orientation-change', (event: MediaOrientationChangeEvent) => {
  const { orientation, lock } = event.detail;
});
