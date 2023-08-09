import { html } from 'lit-html';
import {
  CaptionButton,
  ChaptersMenu,
  ChapterTitle,
  MuteButton,
  PlayButton,
  SeekButton,
  SettingsMenu,
  TimeGroup,
  TimeSlider,
  VolumeSlider,
} from './shared-ui';

export function SmallAudioUI() {
  return html`
    <media-captions class="vds-captions"></media-captions>
    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        ${MuteButton({ tooltip: 'top start' })} ${ChapterTitle()}
        ${CaptionButton({ tooltip: 'top' })}${Menus()}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${TimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        <media-time class="vds-time" type="current"></media-time>
        <div class="vds-controls-spacer"></div>
        <media-time class="vds-time" type="duration"></media-time>
      </media-controls-group>

      <media-controls-group class="vds-controls-group">
        <div class="vds-controls-spacer"></div>
        ${SeekButton({ seconds: -10, tooltip: 'top' })}${PlayButton({ tooltip: 'top' })}
        ${SeekButton({ tooltip: 'top', seconds: 10 })}
        <div class="vds-controls-spacer"></div>
      </media-controls-group>
    </media-controls>
  `;
}

export function LargeAudioUI() {
  return html`
    <media-captions class="vds-captions"></media-captions>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">${TimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        ${SeekButton({ seconds: -10, tooltip: 'top start' })}
        ${PlayButton({ tooltip: 'top' })}${SeekButton({ tooltip: 'top', seconds: 10 })}
        ${TimeGroup()}${ChapterTitle()}
        ${MuteButton({ tooltip: 'top' })}${VolumeSlider()}${CaptionButton({ tooltip: 'top' })}
        ${Menus()}
      </media-controls-group>
    </media-controls>
  `;
}

function Menus() {
  const placement = 'top end',
    portal = '.vds-audio-ui';
  return html`
    ${ChaptersMenu({ tooltip: 'top', placement, portal })}
    ${SettingsMenu({ tooltip: 'top end', placement, portal })}
  `;
}
