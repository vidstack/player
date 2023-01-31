import { MediaToggleButton } from '@vidstack/react';

function Toggle() {
  return (
    <MediaToggleButton aria-label="...">
      <svg slot="on">{/* ... */}</svg>
      <svg slot="off">{/* ... */}</svg>
    </MediaToggleButton>
  );
}
