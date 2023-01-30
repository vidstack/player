import { MediaPlayer } from '@vidstack/react';
import {
  type MediaOrientationChangeEvent,
  type ScreenOrientationLockType,
  type ScreenOrientationType,
} from 'vidstack';

function Player() {
  function onOrientationChange(event: MediaOrientationChangeEvent) {
    const { orientation, lock } = event.detail;
  }

  return <MediaPlayer onOrientationChange={onOrientationChange}>{/* ... */}</MediaPlayer>;
}
