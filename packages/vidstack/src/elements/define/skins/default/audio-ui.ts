import { html } from 'lit-html';

import {
  ChaptersMenu,
  ChapterTitle,
  PlayButton,
  SeekButton,
  TimeGroup,
  VolumeSlider,
} from './shared-ui';
import { MuteButton } from './shared-ui';
import { SettingsMenu } from './shared-ui';
import { CaptionButton } from './shared-ui';
import { TimeSlider } from './shared-ui';

export function renderAudio(isMobile: boolean) {
  return isMobile ? MobileUI() : DesktopUI();
}

function MobileUI() {
  return html`
    <div class="vds-media-ui">
      <media-captions class="vds-captions"></media-captions>
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${MuteButton({ tooltip: 'top start' })} ${ChapterTitle()}
          ${CaptionButton({ tooltip: 'top' })} ${ChaptersMenu({ tooltip: 'top' })}
          ${SettingsMenu({ tooltip: 'top end' })}
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
    </div>
  `;
}

function DesktopUI() {
  return html`
    <div class="vds-media-ui">
      <media-captions class="vds-captions"></media-captions>

      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">${TimeSlider()}</media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${SeekButton({ seconds: -10, tooltip: 'top start' })}
          ${PlayButton({ tooltip: 'top' })}${SeekButton({ tooltip: 'top', seconds: 10 })}
          ${TimeGroup()}${ChapterTitle()}
          ${MuteButton({ tooltip: 'top' })}${VolumeSlider()}${CaptionButton({ tooltip: 'top' })}
          ${ChaptersMenu({ tooltip: 'top center', placement: 'top end' })}
          ${SettingsMenu({ tooltip: 'top end', placement: 'top end' })}
        </media-controls-group>
      </media-controls>
    </div>
  `;
}
