import { useMediaRemote } from '@vidstack/react';
import { useRef, type PointerEvent } from 'react';

// This is a child of `<MediaProvider>`
function Fullscreen() {
  const button = useRef<HTMLButtonElement>(null);
  const remote = useMediaRemote(button);

  function onPointerUp({ nativeEvent }: PointerEvent) {
    // - We are providing the "trigger" here.
    // - Trigger events allow us to trace events back to their origin.
    // - The fullscreen change event will have this pointer event in its chain.
    remote.toggleFullscreen(nativeEvent);
  }

  return (
    <button ref={button} onPointerUp={onPointerUp}>
      {/* ... */}
    </button>
  );
}
