import { Media, SliderVideo, TimeSlider } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <TimeSlider>
        <SliderVideo
          src="https://media-files.vidstack.io/240p.mp4"
          onCanPlay={() => {
            /* ... */
          }}
          onError={() => {
            /* ... */
          }}
        />
      </TimeSlider>
    </Media>
  );
}
