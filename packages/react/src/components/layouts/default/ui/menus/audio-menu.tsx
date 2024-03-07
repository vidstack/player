import * as React from 'react';

import { isArray } from 'maverick.js/std';

import { useAudioOptions } from '../../../../../hooks/options/use-audio-options';
import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import * as AudioGainSlider from '../../../../ui/sliders/audio-gain-slider';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultMenuButton, DefaultMenuSection } from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenu() {
  const label = useDefaultLayoutWord('Audio'),
    $canSetAudioGain = useMediaState('canSetAudioGain'),
    $audioTracks = useMediaState('audioTracks'),
    { noAudioGain, icons: Icons } = useDefaultLayoutContext(),
    hasGainSlider = $canSetAudioGain && !noAudioGain,
    $disabled = !hasGainSlider && $audioTracks.length <= 1;

  if ($disabled) return null;

  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <DefaultMenuButton label={label} Icon={Icons.Menu.Audio} />
      <Menu.Content className="vds-menu-items">
        <DefaultAudioTracksMenu />
        {hasGainSlider ? <DefaultAudioBoostMenuSection /> : null}
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioMenu.displayName = 'DefaultAudioMenu';
export { DefaultAudioMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioBoostSection
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioBoostMenuSection() {
  const $audioGain = useMediaState('audioGain'),
    label = useDefaultLayoutWord('Boost'),
    value = Math.round((($audioGain ?? 1) - 1) * 100) + '%',
    $canSetAudioGain = useMediaState('canSetAudioGain'),
    { noAudioGain, icons: Icons } = useDefaultLayoutContext(),
    $disabled = !$canSetAudioGain || noAudioGain,
    min = useGainMin(),
    max = useGainMax();

  if ($disabled) return null;

  return (
    <DefaultMenuSection label={label} value={value}>
      <DefaultMenuSliderItem
        UpIcon={Icons.Menu.AudioBoostUp}
        DownIcon={Icons.Menu.AudioBoostDown}
        isMin={(($audioGain ?? 1) - 1) * 100 <= min}
        isMax={(($audioGain ?? 1) - 1) * 100 === max}
      >
        <DefaultAudioGainSlider />
      </DefaultMenuSliderItem>
    </DefaultMenuSection>
  );
}

DefaultAudioBoostMenuSection.displayName = 'DefaultAudioBoostMenuSection';

function useGainMin() {
  const { audioGains } = useDefaultLayoutContext(),
    min = isArray(audioGains) ? audioGains[0] : audioGains?.min;
  return min ?? 0;
}

function useGainMax() {
  const { audioGains } = useDefaultLayoutContext(),
    max = isArray(audioGains) ? audioGains[audioGains.length - 1] : audioGains?.max;
  return max ?? 300;
}

function useGainStep() {
  const { audioGains } = useDefaultLayoutContext(),
    step = isArray(audioGains) ? audioGains[1] - audioGains[0] : audioGains?.step;
  return step || 25;
}

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioGainSlider() {
  const label = useDefaultLayoutWord('Audio Boost'),
    min = useGainMin(),
    max = useGainMax(),
    step = useGainStep();
  return (
    <AudioGainSlider.Root
      className="vds-audio-gain-slider vds-slider"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      keyStep={step}
    >
      <DefaultSliderParts />
      <DefaultSliderSteps />
    </AudioGainSlider.Root>
  );
}

DefaultAudioGainSlider.displayName = 'DefaultAudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioTracksMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioTracksMenu() {
  const { icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Track'),
    defaultText = useDefaultLayoutWord('Default'),
    $track = useMediaState('audioTrack'),
    options = useAudioOptions();

  if (options.disabled) return null;

  return (
    <Menu.Root className="vds-audio-track-menu vds-menu">
      <DefaultMenuButton
        label={label}
        hint={$track?.label ?? defaultText}
        disabled={options.disabled}
        Icon={Icons.Menu.Audio}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-audio-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-audio-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <div className="vds-radio-check" />
              <Icons.Menu.RadioCheck className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioTracksMenu.displayName = 'DefaultAudioTracksMenu';
