import styles from './time-slider.module.css';

import { SliderChapters } from './slider-chapters';
import { SliderPreview } from './slider-preview';
import { SliderThumb } from './slider-thumb';

export function TimeSlider(props: TimeSliderProps) {
  return (
    <media-time-slider class={styles.slider}>
      <SliderChapters />
      <SliderThumb />
      <SliderPreview thumbnails={props.thumbnails}>
        <div class={styles.chapterTitle} data-part="chapter-title" />
        <media-slider-value class={styles.value} type="pointer" format="time" />
      </SliderPreview>
    </media-time-slider>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}
