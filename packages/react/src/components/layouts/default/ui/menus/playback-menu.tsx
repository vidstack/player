import * as React from 'react';

import { isArray } from 'maverick.js/std';
import { sortVideoQualities } from 'vidstack';

import { useMediaContext } from '../../../../../hooks/use-media-context';
import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import * as QualitySlider from '../../../../ui/sliders/quality-slider';
import * as SpeedSlider from '../../../../ui/sliders/speed-slider';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton, DefaultMenuItem, DefaultMenuSection } from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

/* -------------------------------------------------------------------------------------------------
 * DefaultPlaybackMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultPlaybackMenu() {
  const label = useDefaultLayoutWord('Playback'),
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <Menu.Root className="vds-accessibility-menu vds-menu">
      <DefaultMenuButton label={label} Icon={Icons.Menu.Playback} />
      <Menu.Content className="vds-menu-items">
        <DefaultMenuSection>
          <DefaultLoopMenuCheckbox />
        </DefaultMenuSection>

        <DefaultSpeedMenuSection />

        <DefaultQualityMenuSection />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultPlaybackMenu.displayName = 'DefaultPlaybackMenu';
export { DefaultPlaybackMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultLoopMenuCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultLoopMenuCheckbox() {
  const { remote } = useMediaContext(),
    label = useDefaultLayoutWord('Loop');

  function onChange(checked: boolean, trigger?: Event) {
    remote.userPrefersLoopChange(checked, trigger);
  }

  return (
    <DefaultMenuItem label={label}>
      <DefaultMenuCheckbox label={label} storageKey="vds-player::user-loop" onChange={onChange} />
    </DefaultMenuItem>
  );
}

DefaultLoopMenuCheckbox.displayName = 'DefaultLoopMenuCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultAutoQualityMenuCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultAutoQualityMenuCheckbox() {
  const { remote, qualities } = useMediaContext(),
    $autoQuality = useMediaState('autoQuality'),
    label = useDefaultLayoutWord('Auto');

  function onChange(checked: boolean, trigger?: Event) {
    if (checked) {
      remote.requestAutoQuality(trigger);
    } else {
      remote.changeQuality(qualities.selectedIndex, trigger);
    }
  }

  return (
    <DefaultMenuItem label={label}>
      <DefaultMenuCheckbox label={label} checked={$autoQuality} onChange={onChange} />
    </DefaultMenuItem>
  );
}

DefaultAutoQualityMenuCheckbox.displayName = 'DefaultAutoQualityMenuCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualityMenuSection
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualityMenuSection() {
  const { hideQualityBitrate, icons: Icons } = useDefaultLayoutContext(),
    $canSetQuality = useMediaState('canSetQuality'),
    $qualities = useMediaState('qualities'),
    $quality = useMediaState('quality'),
    label = useDefaultLayoutWord('Quality'),
    autoText = useDefaultLayoutWord('Auto'),
    sortedQualities = React.useMemo(() => sortVideoQualities($qualities), [$qualities]);

  if (!$canSetQuality || $qualities.length <= 1) return null;

  const height = $quality?.height,
    bitrate = !hideQualityBitrate ? $quality?.bitrate : null,
    bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1000000).toFixed(2)} Mbps` : null,
    value = height ? `${height}p${bitrateText ? ` (${bitrateText})` : ''}` : autoText,
    isMin = sortedQualities[0] === $quality,
    isMax = sortedQualities.at(-1) === $quality;

  return (
    <DefaultMenuSection label={label} value={value}>
      <DefaultMenuSliderItem
        UpIcon={Icons.Menu.QualityUp}
        DownIcon={Icons.Menu.QualityDown}
        isMin={isMin}
        isMax={isMax}
      >
        <DefaultQualitySlider />
      </DefaultMenuSliderItem>
      <DefaultAutoQualityMenuCheckbox />
    </DefaultMenuSection>
  );
}

DefaultQualityMenuSection.displayName = 'DefaultQualityMenuSection';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualitySlider() {
  const label = useDefaultLayoutWord('Quality');
  return (
    <QualitySlider.Root className="vds-quality-slider vds-slider" aria-label={label}>
      <DefaultSliderParts />
      <DefaultSliderSteps />
    </QualitySlider.Root>
  );
}

DefaultQualitySlider.displayName = 'DefaultQualitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedMenuSection
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedMenuSection() {
  const { icons: Icons } = useDefaultLayoutContext(),
    $playbackRate = useMediaState('playbackRate'),
    $canSetPlaybackRate = useMediaState('canSetPlaybackRate'),
    label = useDefaultLayoutWord('Speed'),
    normalText = useDefaultLayoutWord('Normal'),
    min = useSpeedMin(),
    max = useSpeedMax(),
    value = $playbackRate === 1 ? normalText : $playbackRate + 'x';

  if (!$canSetPlaybackRate) return null;

  return (
    <DefaultMenuSection label={label} value={value}>
      <DefaultMenuSliderItem
        UpIcon={Icons.Menu.SpeedUp}
        DownIcon={Icons.Menu.SpeedDown}
        isMin={$playbackRate === min}
        isMax={$playbackRate === max}
      >
        <DefaultSpeedSlider />
      </DefaultMenuSliderItem>
    </DefaultMenuSection>
  );
}

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

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedSlider() {
  const label = useDefaultLayoutWord('Speed'),
    min = useSpeedMin(),
    max = useSpeedMax(),
    step = useSpeedStep();

  return (
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
  );
}

DefaultSpeedSlider.displayName = 'DefaultSpeedSlider';
