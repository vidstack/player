import * as React from 'react';

import { isArray } from 'maverick.js/std';

import { useMediaContext } from '../../../../../hooks/use-media-context';
import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import * as QualitySlider from '../../../../ui/sliders/quality-slider';
import * as SpeedSlider from '../../../../ui/sliders/speed-slider';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton } from './items/menu-items';

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
        <DefaultMenuLoopCheckbox />
        <DefaultAutoQualityCheckbox />
        <DefaultMenuSpeedSlider />
        <DefaultMenuQualitySlider />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultPlaybackMenu.displayName = 'DefaultPlaybackMenu';
export { DefaultPlaybackMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuLoopCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuLoopCheckbox() {
  const label = 'Loop',
    { remote } = useMediaContext(),
    translatedLabel = useDefaultLayoutWord(label);

  function onChange(checked: boolean, trigger?: Event) {
    remote.userPrefersLoopChange(checked, trigger);
  }

  return (
    <div className="vds-menu-item vds-menu-item-checkbox">
      <div className="vds-menu-checkbox-label">{translatedLabel}</div>
      <DefaultMenuCheckbox label={label} storageKey="vds-player::user-loop" onChange={onChange} />
    </div>
  );
}

DefaultMenuLoopCheckbox.displayName = 'DefaultMenuLoopCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultAutoQualityCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultAutoQualityCheckbox() {
  const label = 'Auto Select',
    { remote, qualities } = useMediaContext(),
    $autoQuality = useMediaState('autoQuality'),
    translatedLabel = useDefaultLayoutWord(label);

  function onChange(checked: boolean, trigger?: Event) {
    if (checked) {
      remote.requestAutoQuality(trigger);
    } else {
      remote.changeQuality(qualities.selectedIndex, trigger);
    }
  }

  return (
    <div className="vds-menu-item vds-menu-item-checkbox">
      <div className="vds-menu-checkbox-label">{translatedLabel}</div>
      <DefaultMenuCheckbox label={label} checked={$autoQuality} onChange={onChange} />
    </div>
  );
}

DefaultAutoQualityCheckbox.displayName = 'DefaultAutoQualityCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuQualitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuQualitySlider() {
  const { hideQualityBitrate, icons: Icons } = useDefaultLayoutContext(),
    $canSetQuality = useMediaState('playbackRate'),
    $qualities = useMediaState('qualities'),
    $quality = useMediaState('quality'),
    label = useDefaultLayoutWord('Quality'),
    autoText = useDefaultLayoutWord('Auto');

  if (!$canSetQuality || $qualities.length === 0) return null;

  const height = $quality?.height,
    bitrate = !hideQualityBitrate ? $quality?.bitrate : null,
    bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1000000).toFixed(2)} Mbps` : null,
    value = height ? `${height}p${bitrateText ? ` (${bitrateText})` : ''}` : autoText;

  return (
    <div className="vds-menu-item vds-menu-item-slider">
      <div className="vds-menu-slider-title">
        <span className="vds-menu-slider-label">{label}</span>
        <span className="vds-menu-slider-value">{value}</span>
      </div>
      <div className="vds-menu-slider-group">
        <Icons.Menu.QualityDown className="vds-icon" />
        <DefaultQualitySlider />
        <Icons.Menu.QualityUp className="vds-icon" />
      </div>
    </div>
  );
}

DefaultMenuQualitySlider.displayName = 'DefaultMenuQualitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultQualitySlider() {
  const label = useDefaultLayoutWord('Quality');
  return (
    <QualitySlider.Root className="vds-quality-slider vds-slider" aria-label={label}>
      <QualitySlider.Track className="vds-slider-track" />
      <QualitySlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <QualitySlider.Thumb className="vds-slider-thumb" />
    </QualitySlider.Root>
  );
}

DefaultQualitySlider.displayName = 'DefaultQualitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuSpeedSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuSpeedSlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    $playbackRate = useMediaState('playbackRate'),
    label = useDefaultLayoutWord('Speed'),
    normalText = useDefaultLayoutWord('Normal'),
    value = $playbackRate === 1 ? normalText : $playbackRate + 'x';

  return (
    <div className="vds-menu-item vds-menu-item-slider">
      <div className="vds-menu-slider-title">
        <span className="vds-menu-slider-label">{label}</span>
        <span className="vds-menu-slider-value">{value}</span>
      </div>
      <div className="vds-menu-slider-group">
        <Icons.Menu.SpeedDown className="vds-icon" />
        <DefaultSpeedSlider />
        <Icons.Menu.SpeedUp className="vds-icon" />
      </div>
    </div>
  );
}

DefaultMenuSpeedSlider.displayName = 'DefaultMenuSpeedSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultSpeedSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultSpeedSlider() {
  const label = useDefaultLayoutWord('Speed'),
    { playbackRates: rates } = useDefaultLayoutContext(),
    min = (isArray(rates) ? rates[0] : rates?.min) || 0,
    max = (isArray(rates) ? rates[rates.length - 1] : rates?.max) || 2,
    step = (isArray(rates) ? rates[1] - rates[0] : rates?.step) || 0.25;
  return (
    <SpeedSlider.Root
      className="vds-speed-slider vds-slider"
      aria-label={label}
      min={min}
      max={max}
      step={step}
    >
      <SpeedSlider.Track className="vds-slider-track" />
      <SpeedSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <SpeedSlider.Thumb className="vds-slider-thumb" />
    </SpeedSlider.Root>
  );
}

DefaultSpeedSlider.displayName = 'DefaultSpeedSlider';
