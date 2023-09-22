import buttonStyles from './button.module.css';
import styles from './caption-button.module.css';

import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function CaptionButton(props: CaptionButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-caption-button class={buttonStyles.button}>
          <media-icon class={styles.onIcon} type="closed-captions-on" />
          <media-icon class={styles.offIcon} type="closed-captions" />
        </media-caption-button>
      }
      contentSlot={
        <>
          <span class={styles.onTooltipText}>Closed-Captions Off</span>
          <span class={styles.offTooltipText}>Closed-Captions On</span>
        </>
      }
    />
  );
}

export interface CaptionButtonProps {
  tooltipPlacement: TooltipPlacement;
}
