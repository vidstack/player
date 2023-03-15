import { MediaRemoteControl } from 'vidstack';

const remote = new MediaRemoteControl();

firstMenuItem.addEventListener('pointerdown', (event) => {
  // set mode of text track in list (at index 0)
  remote.changeTextTrackMode(0, 'showing', event);
});
