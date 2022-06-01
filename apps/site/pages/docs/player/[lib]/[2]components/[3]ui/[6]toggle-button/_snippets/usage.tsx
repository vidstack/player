import { ToggleButton } from '@vidstack/player/react';

function MyToggleButton() {
  return (
    <ToggleButton aria-label="...">
      <div className="pressed">Pressed</div>
      <div className="not-pressed">Not Pressed</div>
    </ToggleButton>
  );
}
