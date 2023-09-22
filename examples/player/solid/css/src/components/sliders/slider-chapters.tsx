import styles from './slider-chapters.module.css';

export function SliderChapters() {
  return (
    <media-slider-chapters class={styles.chapters}>
      <template>
        <SliderChapter />
      </template>
    </media-slider-chapters>
  );
}

function SliderChapter() {
  return (
    <div class={styles.chapter}>
      <div class={styles.track} />
      <div class={`${styles.track} ${styles.trackFill}`} />
      <div class={`${styles.track} ${styles.progress}`} />
    </div>
  );
}
