import styles from './time-group.module.css';

export function TimeGroup() {
  return (
    <div class={styles.group}>
      <media-time class={styles.time} type="current" />
      <div class={styles.divider}>/</div>
      <media-time class={styles.time} type="duration" />
    </div>
  );
}
