import { Media } from '@vidstack/react';
import {
  type ScreenOrientationChangeEvent,
  type ScreenOrientationLockType,
  type ScreenOrientationType,
} from 'vidstack';

function MediaPlayer() {
  function onScreenOrientationChange(event: ScreenOrientationChangeEvent) {
    const { orientation, lockType } = event.detail;
  }

  return <Media onScreenOrientationChange={onScreenOrientationChange}>{/* ... */}</Media>;
}
