import { html } from 'lit-html';

import { useMediaContext } from '../../../../core/api/media-context';
import { $computed } from '../../../lit/directives/signal';
import {
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultLiveButton,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultSettingsMenu,
  DefaultTimeInfo,
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
        ${$computed(DefaultTimeInfo)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
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
        ${$computed(DefaultLivePlayButton)}
        ${DefaultMuteButton({ tooltip: 'top start' })}${$computed(DefaultLiveButton)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
        ${DefaultCaptionButton({ tooltip: 'top' })}${DefaultAudioMenus()}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      ${$computed(DefaultTimeControlsGroup)}${$computed(DefaultBottomControlsGroup)}
    </media-controls>
  `;
}

function DefaultLivePlayButton() {
  const { live, canSeek } = useMediaContext().$state;
  return live() && !canSeek() ? DefaultPlayButton({ tooltip: 'top start' }) : null;
}

function DefaultTimeControlsGroup() {
  const { live } = useMediaContext().$state;
  return !live()
    ? html`
        <media-controls-group class="vds-controls-group">
          <media-time class="vds-time" type="current"></media-time>
          <div class="vds-controls-spacer"></div>
          <media-time class="vds-time" type="duration"></media-time>
        </media-controls-group>
      `
    : null;
}

function DefaultBottomControlsGroup() {
  const { canSeek } = useMediaContext().$state;
  return canSeek()
    ? html`
        <media-controls-group class="vds-controls-group">
          <div class="vds-controls-spacer"></div>
          ${DefaultSeekButton({ seconds: -10, tooltip: 'top' })}
          ${DefaultPlayButton({ tooltip: 'top' })}
          ${DefaultSeekButton({ tooltip: 'top', seconds: 10 })}
          <div class="vds-controls-spacer"></div>
        </media-controls-group>
      `
    : null;
}

function DefaultAudioMenus() {
  const placement = 'top end';
  return html`
    ${DefaultChaptersMenu({ tooltip: 'top', placement, portal: true })}
    ${DefaultSettingsMenu({ tooltip: 'top end', placement, portal: true })}
  `;
}
