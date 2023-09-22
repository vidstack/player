import buttonStyles from './button.module.css';
import styles from './pip-button.module.css';

import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PIPButton(props: PIPButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-pip-button class={buttonStyles.button}>
          <media-icon class={styles.enterIcon} type="picture-in-picture" />
          <media-icon class={styles.exitIcon} type="picture-in-picture-exit" />
        </media-pip-button>
      }
      contentSlot={
        <>
          <span class={styles.enterTooltipText}>Enter PIP</span>
          <span class={styles.exitTooltipText}>Exit PIP</span>
        </>
      }
    />
  );
}

export interface PIPButtonProps {
  tooltipPlacement: TooltipPlacement;
}
