import { html } from 'lit-html';
import { computed } from 'maverick.js';

import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { useMediaState } from '../../../../core/api/media-context';
import { $signal } from '../../../lit/directives/signal';
import { DefaultVideoKeyboardActionDisplay } from './keyboard-action-display';
import {
  DefaultAirPlayButton,
  DefaultCaptionButton,
  DefaultCaptions,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultControlsSpacer,
  DefaultFullscreenButton,
  DefaultGoogleCastButton,
  DefaultMuteButton,
  DefaultPIPButton,
  DefaultPlayButton,
  DefaultSettingsMenu,
  DefaultTimeInfo,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-layout';

export function DefaultVideoLayoutLarge() {
  return [
    DefaultVideoGestures(),
    DefaultBufferingIndicator(),
    DefaultVideoKeyboardActionDisplay(),
    DefaultCaptions(),
    html`<div class="vds-scrim"></div>`,
    html`
      <media-controls class="vds-controls">
        ${[
          DefaultControlsGroupTop(),
          DefaultControlsSpacer(),
          html`<media-controls-group class="vds-controls-group"></media-controls-group>`,
          DefaultControlsSpacer(),
          html`
            <media-controls-group class="vds-controls-group">
              ${DefaultTimeSlider()}
            </media-controls-group>
          `,
          html`
            <media-controls-group class="vds-controls-group">
              ${[
                DefaultPlayButton({ tooltip: 'top start' }),
                DefaultMuteButton({ tooltip: 'top' }),
                DefaultVolumeSlider(),
                DefaultTimeInfo(),
                DefaultChapterTitle(),
                DefaultCaptionButton({ tooltip: 'top' }),
                DefaultBottomMenuGroup(),
                DefaultAirPlayButton({ tooltip: 'top' }),
                DefaultGoogleCastButton({ tooltip: 'top' }),
                DefaultPIPButton(),
                DefaultFullscreenButton({ tooltip: 'top end' }),
              ]}
            </media-controls-group>
          `,
        ]}
      </media-controls>
    `,
  ];
}

function DefaultBottomMenuGroup() {
  return $signal(() => {
    const { menuGroup } = useDefaultLayoutContext();
    return menuGroup() === 'bottom' ? DefaultVideoMenus() : null;
  });
}

function DefaultControlsGroupTop() {
  return html`
    <media-controls-group class="vds-controls-group">
      ${$signal(() => {
        const { menuGroup } = useDefaultLayoutContext();
        return menuGroup() === 'top' ? [DefaultControlsSpacer(), DefaultVideoMenus()] : null;
      })}
    </media-controls-group>
  `;
}

export function DefaultVideoLayoutSmall() {
  return [
    DefaultVideoGestures(),
    DefaultBufferingIndicator(),
    DefaultCaptions(),
    html`<div class="vds-scrim"></div>`,
    html`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
            DefaultAirPlayButton({ tooltip: 'top start' }),
            DefaultGoogleCastButton({ tooltip: 'bottom start' }),
            DefaultControlsSpacer(),
            DefaultCaptionButton({ tooltip: 'bottom' }),
            DefaultVideoMenus(),
            DefaultMuteButton({ tooltip: 'bottom end' }),
          ]}
        </media-controls-group>

        ${DefaultControlsSpacer()}

        <media-controls-group class="vds-controls-group" style="pointer-events: none;">
          ${[
            DefaultControlsSpacer(),
            DefaultPlayButton({ tooltip: 'top' }),
            DefaultControlsSpacer(),
          ]}
        </media-controls-group>

        ${DefaultControlsSpacer()}

        <media-controls-group class="vds-controls-group">
          ${[
            DefaultTimeInfo(),
            DefaultChapterTitle(),
            DefaultFullscreenButton({ tooltip: 'top end' }),
          ]}
        </media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${DefaultTimeSlider()}
        </media-controls-group>
      </media-controls>
    `,
    StartDuration(),
  ];
}

export function DefaultVideoLoadLayout() {
  return html`
    <div class="vds-load-container">
      ${[DefaultBufferingIndicator(), DefaultPlayButton({ tooltip: 'top' })]}
    </div>
  `;
}

function StartDuration() {
  return $signal(() => {
    const { duration } = useMediaState();

    if (duration() === 0) return null;

    return html`
      <div class="vds-start-duration">
        <media-time class="vds-time" type="duration"></media-time>
      </div>
    `;
  });
}

export function DefaultBufferingIndicator() {
  return html`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `;
}

function DefaultVideoMenus() {
  const { menuGroup, smallWhen: smWhen } = useDefaultLayoutContext(),
    $side = () => (menuGroup() === 'top' || smWhen() ? 'bottom' : 'top'),
    $tooltip = computed(() => `${$side()} ${menuGroup() === 'top' ? 'end' : 'center'}` as const),
    $placement = computed(() => `${$side()} end` as const);

  return [
    DefaultChaptersMenu({ tooltip: $tooltip, placement: $placement, portal: true }),
    DefaultSettingsMenu({ tooltip: $tooltip, placement: $placement, portal: true }),
  ];
}

function DefaultVideoGestures() {
  return $signal(() => {
    const { noGestures } = useDefaultLayoutContext();

    if (noGestures()) return null;

    return html`
      <div class="vds-gestures">
        <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="pointerup"
          action="toggle:controls"
        ></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="dblpointerup"
          action="toggle:fullscreen"
        ></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
      </div>
    `;
  });
}
