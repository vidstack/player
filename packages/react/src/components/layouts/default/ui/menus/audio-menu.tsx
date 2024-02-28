import * as React from 'react';

import { useAudioOptions } from '../../../../../hooks/options/use-audio-options';
import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import * as AudioGainSlider from '../../../../ui/sliders/audio-gain-slider';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultMenuButton } from './items/menu-items';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenu() {
  const label = useDefaultLayoutWord('Audio'),
    $canSetAudioGain = useMediaState('canSetAudioGain'),
    $audioTracks = useMediaState('audioTracks'),
    { noAudioGainSlider, icons: Icons } = useDefaultLayoutContext(),
    hasGainSlider = $canSetAudioGain && !noAudioGainSlider,
    $disabled = !hasGainSlider && !$audioTracks.length;

  if ($disabled) return null;

  return (
    <Menu.Root className="vds-audio-menu vds-menu">
      <DefaultMenuButton label={label} Icon={Icons.Menu.Audio} />
      <Menu.Content className="vds-menu-items">
        {hasGainSlider ? <DefaultMenuAudioGainSlider /> : null}
        <DefaultAudioTracksMenu />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioMenu.displayName = 'DefaultAudioMenu';
export { DefaultAudioMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuAudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuAudioGainSlider() {
  const label = useDefaultLayoutWord('Audio Boost'),
    $audioGain = useMediaState('audioGain'),
    value = Math.round((($audioGain ?? 1) - 1) * 100) + '%',
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <div className="vds-menu-item vds-menu-item-slider">
      <div className="vds-menu-slider-title">
        <span className="vds-menu-slider-label">{label}</span>
        <span className="vds-menu-slider-value">{value}</span>
      </div>
      <div className="vds-menu-slider-group">
        <Icons.Menu.AudioBoostDown className="vds-icon" />
        <DefaultAudioGainSlider />
        <Icons.Menu.AudioBoostUp className="vds-icon" />
      </div>
    </div>
  );
}

DefaultMenuAudioGainSlider.displayName = 'DefaultMenuAudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioGainSlider() {
  const label = useDefaultLayoutWord('Audio Boost'),
    { maxAudioGain } = useDefaultLayoutContext();
  return (
    <AudioGainSlider.Root
      className="vds-audio-gain-slider vds-slider"
      aria-label={label}
      max={maxAudioGain}
    >
      <AudioGainSlider.Track className="vds-slider-track" />
      <AudioGainSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <AudioGainSlider.Thumb className="vds-slider-thumb" />
    </AudioGainSlider.Root>
  );
}

DefaultAudioGainSlider.displayName = 'DefaultAudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioTracksMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioTracksMenu() {
  const { icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Audio Track'),
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
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAudioTracksMenu.displayName = 'DefaultAudioTracksMenu';
