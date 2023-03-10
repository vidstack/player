import { useMediaRemote } from '@vidstack/react';
import { type PointerEvent } from 'react';

// This is a child of `<MediaPlayer>`
function PictureInPicture() {
  const remote = useMediaRemote();

  function onPointerUp({ nativeEvent }: PointerEvent) {
    // - We are providing the "trigger" here.
    // - Trigger events allow us to trace events back to their origin.
    // - The picture-in-picture-change event will have this pointer event in its chain.
    remote.togglePictureInPicture(nativeEvent);
  }

  return <button onPointerUp={onPointerUp}>{/* ... */}</button>;
}
