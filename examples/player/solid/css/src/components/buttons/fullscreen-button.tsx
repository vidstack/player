import buttonStyles from './button.module.css';
import styles from './fullscreen-button.module.css';

import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function FullscreenButton(props: FullscreenButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-fullscreen-button class={buttonStyles.button}>
          <media-icon class={styles.enterIcon} type="fullscreen" />
          <media-icon class={styles.exitIcon} type="fullscreen-exit" />
        </media-fullscreen-button>
      }
      contentSlot={
        <>
          <span class={styles.enterTooltipText}>Enter Fullscreen</span>
          <span class={styles.exitTooltipText}>Exit Fullscreen</span>
        </>
      }
    />
  );
}

export interface FullscreenButtonProps {
  tooltipPlacement: TooltipPlacement;
}
