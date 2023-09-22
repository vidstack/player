import buttonStyles from './button.module.css';
import styles from './mute-button.module.css';

import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function MuteButton(props: MuteButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-mute-button class={buttonStyles.button}>
          <media-icon class={styles.muteIcon} type="mute" />
          <media-icon class={styles.volumeLowIcon} type="volume-low" />
          <media-icon class={styles.volumeHighIcon} type="volume-high" />
        </media-mute-button>
      }
      contentSlot={
        <>
          <span class={styles.muteTooltipText}>Unmute</span>
          <span class={styles.unmuteTooltipText}>Mute</span>
        </>
      }
    />
  );
}

export interface MuteButtonProps {
  tooltipPlacement: TooltipPlacement;
}
