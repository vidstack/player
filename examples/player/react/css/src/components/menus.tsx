import type { ReactNode } from 'react';

import buttonStyles from '../styles/button.module.css';
import styles from '../styles/menu.module.css';
import tooltipStyles from '../styles/tooltip.module.css';

import {
  Menu,
  Tooltip,
  useCaptionOptions,
  type MenuPlacement,
  type TooltipPlacement,
} from '@vidstack/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  SettingsIcon,
} from '@vidstack/react/icons';

export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}

export function Settings({ placement, tooltipPlacement }: SettingsProps) {
  return (
    <Menu.Root className="menu">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={`${styles.menuButton} ${buttonStyles.button}`}>
            <SettingsIcon className={styles.rotateIcon} />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipStyles.tooltip} placement={tooltipPlacement}>
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content className={styles.menu} placement={placement}>
        <CaptionSubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off';
  return (
    <Menu.Root label="Captions">
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={styles.submenu}>
        <Menu.RadioGroup className={styles.radioGroup} value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Menu.Radio className={styles.radio} value={value} onSelect={select} key={value}>
              <div className={styles.radioCheck} />
              <span>{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: ReactNode;
}

function SubmenuButton({ label, hint, icon: Icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button className={styles.submenuButton} disabled={disabled}>
      <ChevronLeftIcon className={styles.submenuCloseIcon} />
      <Icon className={styles.submenuIcon} />
      <span className={styles.submenuLabel}>{label}</span>
      <span className={styles.submenuHint}>{hint}</span>
      <ChevronRightIcon className={styles.submenuOpenIcon} />
    </Menu.Button>
  );
}
