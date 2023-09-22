import styles from './slider-preview.module.css';

import { Show, type JSX } from 'solid-js';

export function SliderPreview(props: SliderPreviewProps) {
  return (
    <media-slider-preview class={styles.preview} noClamp={props.noClamp}>
      <Show when={props.thumbnails}>
        <media-slider-thumbnail class={styles.thumbnail} src={props.thumbnails} />
      </Show>

      {props.children}
    </media-slider-preview>
  );
}

export interface SliderPreviewProps {
  thumbnails?: string;
  noClamp?: boolean;
  children: JSX.Element;
}
