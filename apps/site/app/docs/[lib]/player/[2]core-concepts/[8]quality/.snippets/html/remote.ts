import { MediaRemoteControl } from 'vidstack';

const remote = new MediaRemoteControl();

autoMenuItem.addEventListener('pointerdown', (event) => {
  // -1 will set auto-quality selection
  remote.changeQuality(-1, event);
});

menuItem.addEventListener('pointerdown', (event) => {
  // select first playback quality in list (at index 0)
  remote.changeQuality(0, event);
});
