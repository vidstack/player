import { Media, Time } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <Time type="current" />
      <Time type="seekable" />
      <Time type="buffered" />
      <Time type="duration" />
      <Time type="current" remainder />
    </Media>
  );
}
