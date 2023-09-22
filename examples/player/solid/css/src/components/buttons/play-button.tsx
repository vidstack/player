import buttonStyle from './button.module.css';
import styles from './play-button.module.css';

import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PlayButton(props: PlayButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-play-button class={buttonStyle.button}>
          <media-icon class={styles.playIcon} type="play" />
          <media-icon class={styles.pauseIcon} type="pause" />
        </media-play-button>
      }
      contentSlot={
        <>
          <span class={styles.playTooltipText}>Play</span>
          <span class={styles.pauseTooltipText}>Pause</span>
        </>
      }
    />
  );
}

export interface PlayButtonProps {
  tooltipPlacement: TooltipPlacement;
}
