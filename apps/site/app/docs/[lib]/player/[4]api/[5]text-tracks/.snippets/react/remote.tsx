import {
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  useMediaRemote,
  useMediaStore,
} from '@vidstack/react';
import { type PointerEvent } from 'react';
import { isTrackCaptionKind, type TextTrack } from 'vidstack';

function MenuItems() {
  const { textTracks } = useMediaStore();
  return <ul>{textTracks.map(MenuItem)}</ul>;
}

function MenuItem(track: TextTrack, index: number) {
  const remote = useMediaRemote();
  const { textTrack: activeTrack } = useMediaStore();

  if (!isTrackCaptionKind(track)) return null;

  function onSelect(event: PointerEvent) {
    remote.changeTextTrackMode(index, 'showing', event.nativeEvent);
  }

  return (
    <li onPointerDown={onSelect}>
      {track === activeTrack ? <RadioButtonSelectedIcon /> : <RadioButtonIcon />}
      {track.label}
    </li>
  );
}
