import { html } from 'lit-html';
import { computed } from 'maverick.js';

import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { useMediaContext } from '../../../../core/api/media-context';
import { $computed } from '../../../lit/directives/signal';
import { DefaultVideoKeyboardActionDisplay } from './keyboard-action-display';
import {
  DefaultAirPlayButton,
  DefaultCaptionButton,
  DefaultChaptersMenu,
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
    html`<media-captions class="vds-captions"></media-captions>`,
    html`<div class="vds-scrim"></div>`,
    html`
      <media-controls class="vds-controls">
        ${DefaultControlsGroupTop()}
        <div class="vds-controls-spacer"></div>
        <media-controls-group class="vds-controls-group">
          ${DefaultTimeSlider()}
        </media-controls-group>
        <media-controls-group class="vds-controls-group">
          ${[
            DefaultPlayButton({ tooltip: 'top start' }),
            DefaultMuteButton({ tooltip: 'top' }),
            DefaultVolumeSlider(),
            DefaultTimeInfo(),
            html`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`,
            DefaultCaptionButton({ tooltip: 'top' }),
            DefaultBottomMenuGroup(),
            DefaultAirPlayButton({ tooltip: 'top' }),
            DefaultGoogleCastButton({ tooltip: 'top' }),
            DefaultPIPButton(),
            DefaultFullscreenButton({ tooltip: 'top end' }),
          ]}
        </media-controls-group>
      </media-controls>
    `,
  ];
}

function DefaultBottomMenuGroup() {
  return $computed(() => {
    const { menuGroup } = useDefaultLayoutContext();
    return menuGroup() === 'bottom' ? DefaultVideoMenus() : null;
  });
}

function DefaultControlsGroupTop() {
  return $computed(() => {
    const { menuGroup } = useDefaultLayoutContext(),
      children =
        menuGroup() === 'top'
          ? html`
              <div class="vds-controls-spacer"></div>
              ${DefaultVideoMenus()}
            `
          : null;

    return html`
      <media-controls-group class="vds-controls-group">${children}</media-controls-group>
    `;
  });
}

export function DefaultVideoLayoutSmall() {
  return [
    DefaultVideoGestures(),
    DefaultBufferingIndicator(),
    html`<media-captions class="vds-captions"></media-captions>`,
    html`<div class="vds-scrim"></div>`,
    html`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
            DefaultAirPlayButton({ tooltip: 'top start' }),
            DefaultGoogleCastButton({ tooltip: 'bottom start' }),
            html`<div class="vds-controls-spacer"></div>`,
            DefaultCaptionButton({ tooltip: 'bottom' }),
            DefaultVideoMenus(),
            DefaultMuteButton({ tooltip: 'bottom end' }),
          ]}
        </media-controls-group>

        <div class="vds-controls-group">${DefaultPlayButton({ tooltip: 'top' })}</div>

        <media-controls-group class="vds-controls-group">
          ${[
            DefaultTimeInfo(),
            html`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`,
            html`<div class="vds-controls-spacer"></div>`,
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
  return $computed(() => {
    const { duration } = useMediaContext().$state;

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
  return $computed(() => {
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
