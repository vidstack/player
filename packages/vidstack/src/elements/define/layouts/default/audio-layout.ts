import { html } from 'lit-html';

import {
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultSettingsMenu,
  DefaultTimeGroup,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-layout';

export function DefaultAudioLayoutLarge() {
  return html`
    <media-captions class="vds-captions"></media-captions>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        ${DefaultSeekButton({ seconds: -10, tooltip: 'top start' })}
        ${DefaultPlayButton({ tooltip: 'top' })}${DefaultSeekButton({
          tooltip: 'top',
          seconds: 10,
        })}
        ${DefaultTimeGroup()}
        <media-chapter-title class="vds-media-title"></media-chapter-title>
        ${DefaultMuteButton({ tooltip: 'top' })}
        ${DefaultVolumeSlider()}${DefaultCaptionButton({ tooltip: 'top' })} ${DefaultAudioMenus()}
      </media-controls-group>
    </media-controls>
  `;
}

export function DefaultAudioLayoutSmall() {
  return html`
    <media-captions class="vds-captions"></media-captions>
    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        ${DefaultMuteButton({ tooltip: 'top start' })}
        <media-chapter-title class="vds-media-title"></media-chapter-title>
        ${DefaultCaptionButton({ tooltip: 'top' })}${DefaultAudioMenus()}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        <media-time class="vds-time" type="current"></media-time>
        <div class="vds-controls-spacer"></div>
        <media-time class="vds-time" type="duration"></media-time>
      </media-controls-group>

      <media-controls-group class="vds-controls-group">
        <div class="vds-controls-spacer"></div>
        ${DefaultSeekButton({ seconds: -10, tooltip: 'top' })}
        ${DefaultPlayButton({ tooltip: 'top' })}
        ${DefaultSeekButton({ tooltip: 'top', seconds: 10 })}
        <div class="vds-controls-spacer"></div>
      </media-controls-group>
    </media-controls>
  `;
}

function DefaultAudioMenus() {
  const placement = 'top end';
  return html`
    ${DefaultChaptersMenu({ tooltip: 'top', placement })}
    ${DefaultSettingsMenu({ tooltip: 'top end', placement })}
  `;
}
