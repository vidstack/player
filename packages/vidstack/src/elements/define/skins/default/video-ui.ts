import { html } from 'lit-html';
import {
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultFullscreenButton,
  DefaultMuteButton,
  DefaultPIPButton,
  DefaultPlayButton,
  DefaultSettingsMenu,
  DefaultTimeGroup,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-ui';

export function DefaultVideoLayout() {
  return html`
    ${DefaultVideoGestures()}${DefaultBufferingIndicator()}
    <media-captions class="vds-captions"></media-captions>

    <div class="vds-scrim"></div>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        <div class="vds-controls-spacer"></div>
        ${DefaultVideoMenus()}
      </media-controls-group>

      <div class="vds-controls-spacer"></div>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        ${DefaultPlayButton({ tooltip: 'top start' })}
        ${DefaultMuteButton({ tooltip: 'top' })}${DefaultVolumeSlider()}${DefaultTimeGroup()}
        ${DefaultChapterTitle()}${DefaultCaptionButton({ tooltip: 'top' })}${DefaultPIPButton()}
        ${DefaultFullscreenButton({ tooltip: 'top end' })}
      </media-controls-group>
    </media-controls>
  `;
}

export function DefaultVideoSmallLayout() {
  return html`
    ${DefaultVideoGestures()}${DefaultBufferingIndicator()}
    <media-captions class="vds-captions"></media-captions>

    <div class="vds-scrim"></div>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        <div class="vds-controls-spacer"></div>
        ${DefaultCaptionButton({ tooltip: 'bottom' })}
        ${DefaultVideoMenus()}${DefaultMuteButton({ tooltip: 'bottom end' })}
      </media-controls-group>

      <div class="vds-controls-group">${DefaultPlayButton({ tooltip: 'top' })}</div>

      <media-controls-group class="vds-controls-group">
        ${DefaultTimeGroup()}${DefaultChapterTitle()}
        <div class="vds-controls-spacer"></div>
        ${DefaultFullscreenButton({ tooltip: 'top end' })}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>
    </media-controls>

    <div class="vds-start-duration">
      <media-time class="vds-time" type="duration"></media-time>
    </div>
  `;
}

function DefaultBufferingIndicator() {
  return html`
    <div class="vds-buffering-indicator">
      <svg class="vds-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
        <circle class="vds-buffering-track" cx="60" cy="60" r="54" stroke="currentColor"></circle>
        <circle
          class="vds-buffering-track-fill"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
        ></circle>
      </svg>
    </div>
  `;
}

function DefaultVideoMenus() {
  const tooltip = 'bottom end',
    placement = 'bottom end',
    container = 'body > .vds-video-ui';
  return html`
    ${DefaultChaptersMenu({ tooltip, placement, container })}
    ${DefaultSettingsMenu({ tooltip, placement, container })}
  `;
}

function DefaultVideoGestures() {
  return html`
    <div class="vds-gestures">
      <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
      <media-gesture class="vds-gesture" event="pointerup" action="toggle:controls"></media-gesture>
      <media-gesture
        class="vds-gesture"
        event="dblpointerup"
        action="toggle:fullscreen"
      ></media-gesture>
      <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
      <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
    </div>
  `;
}
