import { MediaPlayer, MediaSliderVideo, MediaTimeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      <MediaTimeSlider>
        <MediaSliderVideo
          src="https://media-files.vidstack.io/240p.mp4"
          onCanPlay={() => {
            /* ... */
          }}
          onError={() => {
            /* ... */
          }}
        />
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
