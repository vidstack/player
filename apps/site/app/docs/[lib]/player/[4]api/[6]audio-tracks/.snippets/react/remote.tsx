import {
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  useMediaRemote,
  useMediaStore,
} from '@vidstack/react';
import { type PointerEvent } from 'react';
import { type AudioTrack } from 'vidstack';

function MenuItems() {
  const { audioTracks } = useMediaStore();
  return <ul>{audioTracks.map(MenuItem)}</ul>;
}

function MenuItem(track: AudioTrack, index: number) {
  const remote = useMediaRemote();
  const { audioTrack: activeTrack } = useMediaStore();

  function onSelect(event: PointerEvent) {
    remote.changeAudioTrack(index, event.nativeEvent);
  }

  return (
    <li onPointerDown={onSelect}>
      {track === activeTrack ? <RadioButtonSelectedIcon /> : <RadioButtonIcon />}
      {track.label}
    </li>
  );
}
