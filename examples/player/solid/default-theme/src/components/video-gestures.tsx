import styles from './video-gestures.module.css';

export function VideoGestures() {
  return (
    <>
      <media-gesture class={styles.gesture} event="pointerup" action="toggle:paused" />
      <media-gesture class={styles.gesture} event="dblpointerup" action="toggle:fullscreen" />
      <media-gesture class={styles.gesture} event="pointerup" action="toggle:controls" />
      <media-gesture class={styles.gesture} event="dblpointerup" action="seek:-10" />
      <media-gesture class={styles.gesture} event="dblpointerup" action="seek:10" />
    </>
  );
}
