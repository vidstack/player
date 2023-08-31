import { useMediaRemote, useMediaStore } from '@vidstack/react';
import { RadioButtonIcon, RadioButtonSelectedIcon } from '@vidstack/react/icons';
import { type PointerEvent } from 'react';
import { type VideoQuality } from 'vidstack';

function MenuItems() {
  const { qualities, autoQuality } = useMediaStore();
  const remote = useMediaRemote();

  function onAutoSelect(event: PointerEvent) {
    remote.changeQuality(-1, event.nativeEvent);
  }

  return (
    <ul>
      <li onPointerDown={onAutoSelect}>
        {autoQuality ? <RadioButtonSelectedIcon /> : <RadioButtonIcon />} Auto
      </li>
      {qualities.map(MenuItem)}
    </ul>
  );
}

function MenuItem(quality: VideoQuality, index: number) {
  const remote = useMediaRemote();
  const { quality: activeQuality } = useMediaStore();

  function onSelect(event: PointerEvent) {
    remote.changeQuality(index, event.nativeEvent);
  }

  return (
    <li onPointerDown={onSelect}>
      {quality === activeQuality ? <RadioButtonSelectedIcon /> : <RadioButtonIcon />}
      {quality.height + 'p'}
    </li>
  );
}
