import styles from '../styles/slider.module.css';

import { TimeSlider, VolumeSlider } from '@vidstack/react';

export function Volume() {
  return (
    <VolumeSlider.Root className={`volume-slider ${styles.slider} ${styles.sliderSmall}`}>
      <VolumeSlider.Track className={styles.track} />
      <VolumeSlider.TrackFill className={`${styles.trackFill} ${styles.track}`} />
      <VolumeSlider.Preview className={styles.preview} noClamp>
        <VolumeSlider.Value className={styles.volumeValue} type="pointer" format="percent" />
      </VolumeSlider.Preview>
      <VolumeSlider.Thumb className={styles.thumb} />
    </VolumeSlider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  return (
    <TimeSlider.Root className={`time-slider ${styles.slider}`}>
      <TimeSlider.Chapters className={styles.chapters}>
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div className={styles.chapter} key={cue.startTime} ref={forwardRef}>
              <TimeSlider.Track className={styles.track} />
              <TimeSlider.TrackFill className={`${styles.trackFill} ${styles.track}`} />
              <TimeSlider.Progress className={`${styles.progress} ${styles.track}`} />
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb className={styles.thumb} />

      <TimeSlider.Preview className={styles.preview}>
        {thumbnails ? (
          <TimeSlider.Thumbnail.Root src={thumbnails} className={styles.thumbnail}>
            <TimeSlider.Thumbnail.Img />
          </TimeSlider.Thumbnail.Root>
        ) : null}

        <TimeSlider.ChapterTitle className={styles.chapterTitle} />

        <TimeSlider.Value className={styles.timeValue} type="pointer" format="time" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
