import { html, type TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ref as $ref, ref } from 'lit-html/directives/ref.js';
import type { RefOrCallback } from 'lit-html/directives/ref.js';
import { computed, effect, signal, type ReadSignal } from 'maverick.js';
import { isFunction, noop, unwrap, uppercaseFirstChar } from 'maverick.js/std';

import {
  type MenuPlacement,
  type SliderOrientation,
  type TooltipPlacement,
} from '../../../../components';
import {
  useDefaultLayoutContext,
  type DefaultLayoutContext,
} from '../../../../components/layouts/default/context';
import { i18n, type DefaultLayoutWord } from '../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../core/api/media-context';
import { useResizeObserver } from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';
import { DefaultFontMenu } from './font-menu';
import { renderMenuButton } from './menu-layout';

export function DefaultAirPlayButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { remotePlaybackState } = useMediaState(),
    $label = $signal(() => {
      const airPlayText = i18n(translations, 'AirPlay'),
        stateText = uppercaseFirstChar(remotePlaybackState()) as Capitalize<RemotePlaybackState>;
      return `${airPlayText} ${stateText}`;
    }),
    $airPlayText = $i18n(translations, 'AirPlay');
  return html`
    <media-tooltip class="vds-airplay-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-airplay-button class="vds-airplay-button vds-button" aria-label=${$label}>
          <slot name="airplay-icon" data-class="vds-airplay-icon"></slot>
        </media-airplay-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-airplay-tooltip-text">${$airPlayText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultGoogleCastButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { remotePlaybackState } = useMediaState(),
    $label = $signal(() => {
      const googleCastText = i18n(translations, 'Google Cast'),
        stateText = uppercaseFirstChar(remotePlaybackState()) as Capitalize<RemotePlaybackState>;
      return `${googleCastText} ${stateText}`;
    }),
    $googleCastText = $i18n(translations, 'Google Cast');
  return html`
    <media-tooltip class="vds-google-cast-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-google-cast-button class="vds-google-cast-button vds-button" aria-label=${$label}>
          <slot name="google-cast-icon" data-class="vds-google-cast-icon"></slot>
        </media-google-cast-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-google-cast-tooltip-text">${$googleCastText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultPlayButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { paused } = useMediaState(),
    $label = $signal(() => i18n(translations, paused() ? 'Play' : 'Pause')),
    $playText = $i18n(translations, 'Play'),
    $pauseText = $i18n(translations, 'Pause');
  return html`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button class="vds-play-button vds-button" aria-label=${$label}>
          <slot name="play-icon" data-class="vds-play-icon"></slot>
          <slot name="pause-icon" data-class="vds-pause-icon"></slot>
          <slot name="replay-icon" data-class="vds-replay-icon"></slot>
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-play-tooltip-text">${$playText}</span>
        <span class="vds-pause-tooltip-text">${$pauseText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultMuteButton({
  tooltip,
  ref = noop,
}: {
  tooltip: TooltipPlacement;
  ref?: RefOrCallback;
}) {
  const { translations } = useDefaultLayoutContext(),
    { muted } = useMediaState(),
    $label = $signal(() => i18n(translations, muted() ? 'Unmute' : 'Unmute')),
    $muteText = $i18n(translations, 'Mute'),
    $unmuteText = $i18n(translations, 'Unmute');
  return html`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button class="vds-mute-button vds-button" aria-label=${$label} ${$ref(ref)}>
          <slot name="mute-icon" data-class="vds-mute-icon"></slot>
          <slot name="volume-low-icon" data-class="vds-volume-low-icon"></slot>
          <slot name="volume-high-icon" data-class="vds-volume-high-icon"></slot>
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-mute-tooltip-text">${$unmuteText}</span>
        <span class="vds-unmute-tooltip-text">${$muteText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultCaptionButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { textTrack } = useMediaState(),
    $label = $signal(() =>
      i18n(translations, textTrack() ? 'Closed-Captions Off' : 'Closed-Captions On'),
    ),
    $ccOnText = $i18n(translations, 'Closed-Captions On'),
    $ccOffText = $i18n(translations, 'Closed-Captions Off');
  return html`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button class="vds-caption-button vds-button" aria-label=${$label}>
          <slot name="cc-on-icon" data-class="vds-cc-on-icon"></slot>
          <slot name="cc-off-icon" data-class="vds-cc-off-icon"></slot>
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-cc-on-tooltip-text">${$ccOffText}</span>
        <span class="vds-cc-off-tooltip-text">${$ccOnText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultPIPButton() {
  const { translations } = useDefaultLayoutContext(),
    { pictureInPicture } = useMediaState(),
    $label = $signal(() => i18n(translations, pictureInPicture() ? 'Exit PiP' : 'Enter PiP')),
    $enterText = $i18n(translations, 'Enter PiP'),
    $exitText = $i18n(translations, 'Exit PiP');
  return html`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button class="vds-pip-button vds-button" aria-label=${$label}>
          <slot name="pip-enter-icon" data-class="vds-pip-enter-icon"></slot>
          <slot name="pip-exit-icon" data-class="vds-pip-exit-icon"></slot>
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${$enterText}</span>
        <span class="vds-pip-exit-tooltip-text">${$exitText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultFullscreenButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { fullscreen } = useMediaState(),
    $label = $signal(() =>
      i18n(translations, fullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen'),
    ),
    $enterText = $i18n(translations, 'Enter Fullscreen'),
    $exitText = $i18n(translations, 'Exit Fullscreen');
  return html`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button class="vds-fullscreen-button vds-button" aria-label=${$label}>
          <slot name="fs-enter-icon" data-class="vds-fs-enter-icon"></slot>
          <slot name="fs-exit-icon" data-class="vds-fs-exit-icon"></slot>
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-fs-enter-tooltip-text">${$enterText}</span>
        <span class="vds-fs-exit-tooltip-text">${$exitText}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultSeekButton({
  backward,
  tooltip,
}: {
  backward?: boolean;
  tooltip: TooltipPlacement;
}) {
  const { translations, seekStep } = useDefaultLayoutContext(),
    seekText = !backward ? 'Seek Forward' : 'Seek Backward',
    $label = $i18n(translations, seekText),
    $seconds = () => (backward ? -1 : 1) * seekStep();
  return html`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${$signal($seconds)}
          aria-label=${$label}
        >
          ${!backward
            ? html`<slot name="seek-forward-icon"></slot>`
            : html`<slot name="seek-backward-icon"></slot>`}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seekText)}
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultVolumeSlider({ orientation }: { orientation?: SliderOrientation } = {}) {
  const { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Volume');
  return html`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${$label}
      orientation=${ifDefined(orientation)}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `;
}

export function DefaultTimeSlider() {
  const $ref = signal<Element | undefined>(undefined),
    $width = signal(0),
    {
      thumbnails,
      translations,
      sliderChaptersMinWidth,
      disableTimeSlider,
      seekStep,
      noScrubGesture,
    } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Seek'),
    $isDisabled = $signal(disableTimeSlider),
    $isChaptersDisabled = $signal(() => $width() < sliderChaptersMinWidth()),
    $thumbnails = $signal(thumbnails);

  useResizeObserver($ref, () => {
    const el = $ref();
    el && $width.set(el.clientWidth);
  });

  return html`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${$label}
      key-step=${$signal(seekStep)}
      ?disabled=${$isDisabled}
      ?no-swipe-gesture=${$signal(noScrubGesture)}
      ${ref($ref.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$isChaptersDisabled}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          .src=${$thumbnails}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
}

export function DefaultLiveButton() {
  const { translations } = useDefaultLayoutContext(),
    { live } = useMediaState(),
    $label = $i18n(translations, 'Skip To Live'),
    $liveText = $i18n(translations, 'LIVE');
  return live()
    ? html`
        <media-live-button class="vds-live-button" aria-label=${$label}>
          <span class="vds-live-button-text">${$liveText}</span>
        </media-live-button>
      `
    : null;
}

export function DefaultTimeGroup() {
  return html`
    <div class="vds-time-group">
      ${$signal(() => {
        const { duration } = useMediaState();

        if (!duration()) return null;

        return [
          html`<media-time class="vds-time" type="current"></media-time>`,
          html`<div class="vds-time-divider">/</div>`,
          html`<media-time class="vds-time" type="duration"></media-time>`,
        ].filter((f) => (f ? f : null));
      })}
    </div>
  `;
}

export function DefaultTimeInvert() {
  return $signal(() => {
    const { live, duration } = useMediaState();
    return live()
      ? DefaultLiveButton()
      : duration()
        ? html`<media-time class="vds-time" type="current" toggle remainder></media-time>`
        : null;
  });
}

export function DefaultControlsSpacer() {
  return html`<div class="vds-controls-spacer"></div>`;
}

export function DefaultTimeInfo(): any {
  return $signal(() => {
    const { live } = useMediaState();
    return live() ? DefaultLiveButton() : DefaultTimeGroup();
  });
}

function MenuPortal(container: HTMLElement | null, template: TemplateResult) {
  return html`
    <media-menu-portal .container=${container} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
}

export function DefaultTitle() {
  return html`<media-title class="vds-title"></media-title>`;
}

export function DefaultChapterTitle() {
  return html`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`;
}

export function DefaultTitleGroup() {
  return html`<div class="vds-title-group">${DefaultTitle()}${DefaultChapterTitle()}</div>`;
}

export function DefaultChaptersMenu({
  placement,
  tooltip,
  portal,
}: {
  portal?: boolean;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
}) {
  const { viewType } = useMediaState(),
    {
      translations,
      thumbnails,
      menuContainer,
      noModal,
      menuGroup,
      smallWhen: smWhen,
    } = useDefaultLayoutContext(),
    $placement = computed(() =>
      noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
    ),
    $offset = computed(() =>
      !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
    );

  const items = html`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      <media-chapters-radio-group
        class="vds-chapters-radio-group vds-radio-group"
        .thumbnails=${$signal(thumbnails)}
      >
        <template>
          <media-radio class="vds-chapter-radio vds-radio">
            <media-thumbnail class="vds-thumbnail"></media-thumbnail>
            <div class="vds-chapter-radio-content">
              <span class="vds-chapter-radio-label" data-part="label"></span>
              <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
              <span class="vds-chapter-radio-duration" data-part="duration"></span>
            </div>
          </media-radio>
        </template>
      </media-chapters-radio-group>
    </media-menu-items>
  `;

  return html`
    <media-menu class="vds-chapters-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, 'Chapters')}
          >
            <slot name="menu-chapters-icon"></slot>
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, 'Chapters')}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuContainer, items) : items}
    </media-menu>
  `;
}

export function DefaultSettingsMenu({
  placement,
  portal,
  tooltip,
}: {
  portal?: boolean;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
}) {
  return $signal(() => {
    const { viewType, canSetPlaybackRate, canSetQuality, qualities, audioTracks, hasCaptions } =
        useMediaState(),
      {
        translations,
        menuContainer,
        noModal,
        menuGroup,
        smallWhen: smWhen,
      } = useDefaultLayoutContext(),
      $placement = computed(() =>
        noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
      ),
      $offset = computed(() =>
        !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
      ),
      $hasMenuItems = computed(() => {
        return (
          canSetPlaybackRate() ||
          !!(canSetQuality() && qualities().length) ||
          !!audioTracks().length ||
          hasCaptions()
        );
      });

    if (!$hasMenuItems()) return null;

    const items = html`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${$signal($placement)}
        offset=${$signal($offset)}
      >
        ${[
          DefaultAudioMenu(),
          DefaultSpeedMenu(),
          DefaultQualityMenu(),
          DefaultCaptionsMenu(),
          DefaultFontMenu(),
        ]}
      </media-menu-items>
    `;

    return html`
      <media-menu class="vds-settings-menu vds-menu">
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${$i18n(translations, 'Settings')}
            >
              <slot name="menu-settings-icon" data-class="vds-rotate-icon"></slot>
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
          >
            ${$i18n(translations, 'Settings')}
          </media-tooltip-content>
        </media-tooltip>
        ${portal ? MenuPortal(menuContainer, items) : items}
      </media-menu>
    `;
  });
}

function DefaultAudioMenu() {
  const { translations } = useDefaultLayoutContext(),
    $defaultText = $i18n(translations, 'Default');
  return html`
    <media-menu class="vds-audio-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Audio'),
        icon: 'menu-audio',
      })}
      <media-menu-items class="vds-menu-items">
        <media-audio-radio-group
          class="vds-audio-radio-group vds-radio-group"
          empty-label=${$defaultText}
        >
          <template>
            <media-radio class="vds-audio-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-audio-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}

function DefaultSpeedMenu() {
  const { translations } = useDefaultLayoutContext(),
    $normalText = $i18n(translations, 'Normal');
  return html`
    <media-menu class="vds-speed-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Speed'),
        icon: 'menu-speed',
      })}
      <media-menu-items class="vds-menu-items">
        <media-speed-radio-group
          class="vds-speed-radio-group vds-radio-group"
          normal-label=${$normalText}
        >
          <template>
            <media-radio class="vds-speed-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-speed-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}

function DefaultQualityMenu() {
  const { translations } = useDefaultLayoutContext(),
    $autoText = $i18n(translations, 'Auto');
  return html`
    <media-menu class="vds-quality-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Quality'),
        icon: 'menu-quality',
      })}
      <media-menu-items class="vds-menu-items">
        <media-quality-radio-group
          class="vds-quality-radio-group vds-radio-group"
          auto-label=${$autoText}
        >
          <template>
            <media-radio class="vds-quality-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
              <span class="vds-radio-hint" data-part="bitrate"></span>
            </media-radio>
          </template>
        </media-quality-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}

function DefaultCaptionsMenu() {
  const { translations } = useDefaultLayoutContext(),
    $offText = $i18n(translations, 'Off');
  return html`
    <media-menu class="vds-captions-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Captions'),
        icon: 'menu-captions',
      })}
      <media-menu-items class="vds-menu-items">
        <media-captions-radio-group
          class="vds-captions-radio-group vds-radio-group"
          off-label=${$offText}
        >
          <template>
            <media-radio class="vds-caption-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-captions-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}

export function createMenuContainer(className: string) {
  let container = document.querySelector<HTMLElement>(`body > .${className}`);

  if (!container) {
    container = document.createElement('div');
    container.style.display = 'contents';
    container.classList.add(className);
    document.body.append(container);
  }

  return container;
}

function $i18n(translations: DefaultLayoutContext['translations'], word: DefaultLayoutWord) {
  return $signal(() => i18n(translations, word));
}
