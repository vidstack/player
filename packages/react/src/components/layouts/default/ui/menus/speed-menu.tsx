import * as React from 'react';

import { isArray } from 'maverick.js/std';

import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import * as SpeedSlider from '../../../../ui/sliders/speed-slider';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { slot, type DefaultLayoutMenuSlotName, type Slots } from '../../slots';
import { DefaultMenuButton, DefaultMenuSection } from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedMenu
 * -----------------------------------------------------------------------------------------------*/

interface DefaultSpeedMenuProps {
  slots?: Slots<DefaultLayoutMenuSlotName>;
}

function DefaultSpeedMenu({ slots }: DefaultSpeedMenuProps) {
  const { icons: Icons } = useDefaultLayoutContext(),
    $playbackRate = useMediaState('playbackRate'),
    $canSetPlaybackRate = useMediaState('canSetPlaybackRate'),
    label = useDefaultLayoutWord('Speed'),
    normalText = useDefaultLayoutWord('Normal'),
    min = useSpeedMin(),
    max = useSpeedMax(),
    step = useSpeedStep(),
    value = $playbackRate === 1 ? normalText : $playbackRate + 'x';

  if (!$canSetPlaybackRate) return null;

  return (
    <Menu.Root className="vds-speed-menu vds-menu">
      <DefaultMenuButton label={label} hint={value} Icon={Icons.Menu.SpeedUp} />
      <Menu.Content className="vds-menu-items">
        {slot(slots, 'speedMenuItemsStart', null)}

        <DefaultMenuSection label={label} value={value}>
          <DefaultMenuSliderItem
            UpIcon={Icons.Menu.FontSizeUp}
            DownIcon={Icons.Menu.FontSizeDown}
            isMin={$playbackRate === min}
            isMax={$playbackRate === max}
          >
            <SpeedSlider.Root
              className="vds-speed-slider vds-slider"
              aria-label={label}
              min={min}
              max={max}
              step={step}
              keyStep={step}
            >
              <DefaultSliderParts />
              <DefaultSliderSteps />
            </SpeedSlider.Root>
          </DefaultMenuSliderItem>
        </DefaultMenuSection>

        {slot(slots, 'speedMenuItemsEnd', null)}
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultSpeedMenu.displayName = 'DefaultSpeedMenu';
export { DefaultSpeedMenu };

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

function useSpeedMin() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates;
  return (isArray(rates) ? rates[0] : rates?.min) ?? 0;
}

function useSpeedMax() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates;
  return (isArray(rates) ? rates[rates.length - 1] : rates?.max) ?? 2;
}

function useSpeedStep() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates;
  return (isArray(rates) ? rates[1] - rates[0] : rates?.step) || 0.25;
}
