import styles from './menu-radio.module.css';

export function MenuRadio() {
  return (
    <media-radio class={styles.radio}>
      <div class={styles.check} />
      <span data-part="label" />
    </media-radio>
  );
}
