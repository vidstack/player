import { Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <>
      <Video poster="https://media-files.vidstack.io/poster.png">
        {/* Poster is shown while loading or if JS disabled. */}
        <video poster="https://media-files.vidstack.io/poster-seo.png"></video>
      </Video>
    </>
  );
}
