import styles from './volume-slider.module.css';

import { SliderPreview } from './slider-preview';
import { SliderThumb } from './slider-thumb';

export function VolumeSlider() {
  return (
    <media-volume-slider class={styles.slider}>
      <div class={styles.track} />
      <div class={`${styles.track} ${styles.trackFill}`} />
      <SliderThumb />
      <SliderPreview noClamp>
        <media-slider-value class={styles.value} type="pointer" format="percent" />
      </SliderPreview>
    </media-volume-slider>
  );
}
