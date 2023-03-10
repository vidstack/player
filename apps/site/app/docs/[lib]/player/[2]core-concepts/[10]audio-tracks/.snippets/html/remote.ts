import { MediaRemoteControl } from 'vidstack';

const remote = new MediaRemoteControl();

firstMenuItem.addEventListener('pointerdown', (event) => {
  // select first audio track in list (at index 0)
  remote.changeAudioTrack(0, event);
});
