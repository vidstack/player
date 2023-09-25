import { TimeSlider, VolumeSlider } from '@vidstack/react';

export function Volume() {
  return (
    <VolumeSlider.Root className="vds-volume-slider vds-slider">
      <VolumeSlider.Track className="vds-slider-track" />
      <VolumeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <VolumeSlider.Preview className="vds-slider-preview" noClamp>
        <VolumeSlider.Value className="vds-slider-value" type="pointer" format="percent" />
      </VolumeSlider.Preview>
      <VolumeSlider.Thumb className="vds-slider-thumb" />
    </VolumeSlider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  return (
    <TimeSlider.Root className="vds-time-slider vds-slider">
      <TimeSlider.Chapters className="vds-slider-chapters">
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div className="vds-slider-chapter" key={cue.startTime} ref={forwardRef}>
              <TimeSlider.Track className="vds-slider-track" />
              <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb className="vds-slider-thumb" />

      <TimeSlider.Preview className="vds-slider-preview">
        {thumbnails ? (
          <TimeSlider.Thumbnail.Root
            src={thumbnails}
            className="vds-slider-thumbnail vds-thumbnail"
          >
            <TimeSlider.Thumbnail.Img />
          </TimeSlider.Thumbnail.Root>
        ) : null}

        <TimeSlider.ChapterTitle className="vds-slider-chapter-title" />

        <TimeSlider.Value className="vds-slider-value" type="pointer" format="time" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
