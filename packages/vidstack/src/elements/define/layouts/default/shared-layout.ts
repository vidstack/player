import { html, type TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ref as $ref, ref } from 'lit-html/directives/ref.js';
import type { RefOrCallback } from 'lit-html/directives/ref.js';
import { computed, peek, signal, type ReadSignal } from 'maverick.js';
import { isFunction, isKeyboardClick, noop, unwrap, uppercaseFirstChar } from 'maverick.js/std';

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
import { useMediaContext, useMediaState } from '../../../../core/api/media-context';
import { $ariaBool } from '../../../../utils/aria';
import { useResizeObserver } from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';
import { DefaultFontMenu } from './font-menu';
import { renderMenuButton } from './menu-layout';

export function DefaultAnnouncer() {
  const { translations } = useDefaultLayoutContext();
  return html`<media-announcer .translations=${$signal(translations)}></media-announcer>`;
}

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
    $playText = $i18n(translations, 'Play'),
    $pauseText = $i18n(translations, 'Pause');
  return html`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button
          class="vds-play-button vds-button"
          aria-label=${$i18n(translations, 'Play')}
        >
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
    $muteText = $i18n(translations, 'Mute'),
    $unmuteText = $i18n(translations, 'Unmute');
  return html`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button
          class="vds-mute-button vds-button"
          aria-label=${$i18n(translations, 'Mute')}
          ${$ref(ref)}
        >
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
    $ccOnText = $i18n(translations, 'Closed-Captions On'),
    $ccOffText = $i18n(translations, 'Closed-Captions Off');
  return html`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button
          class="vds-caption-button vds-button"
          aria-label=${$i18n(translations, 'Captions')}
        >
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
    $enterText = $i18n(translations, 'Enter PiP'),
    $exitText = $i18n(translations, 'Exit PiP');
  return html`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button
          class="vds-pip-button vds-button"
          aria-label=${$i18n(translations, 'PiP')}
        >
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
    $enterText = $i18n(translations, 'Enter Fullscreen'),
    $exitText = $i18n(translations, 'Exit Fullscreen');
  return html`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button
          class="vds-fullscreen-button vds-button"
          aria-label=${$i18n(translations, 'Fullscreen')}
        >
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

export function DefaultCaptions() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-captions
      class="vds-captions"
      .exampleText=${$i18n(translations, 'Captions look like this')}
    ></media-captions>
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
        ];
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
    const {
        viewType,
        canSetPlaybackRate,
        canSetAudioGain,
        canSetQuality,
        qualities,
        audioTracks,
        hasCaptions,
      } = useMediaState(),
      {
        translations,
        menuContainer,
        noModal,
        menuGroup,
        smallWhen: smWhen,
        noAudioGainSlider,
        playbackRates,
      } = useDefaultLayoutContext(),
      $placement = computed(() =>
        noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
      ),
      $offset = computed(() =>
        !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
      ),
      $hasMenuItems = computed(() => {
        return (
          !!(canSetPlaybackRate() && playbackRates().length) ||
          !!(canSetQuality() && qualities().length) ||
          !!audioTracks().length ||
          (!noAudioGainSlider() && canSetAudioGain()) ||
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
          DefaultMenuLoopCheckbox(),
          DefaultAccessibilityMenu(),
          DefaultAudioMenu(),
          DefaultCaptionsMenu(),
          DefaultSpeedMenu(),
          DefaultQualityMenu(),
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

function DefaultMenuLoopCheckbox() {
  const { remote } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Loop');
  return html`
    <div class="vds-menu-item vds-menu-item-checkbox">
      <slot name="menu-loop-icon" data-class="vds-menu-checkbox-icon"></slot>
      <div class="vds-menu-checkbox-label">${$label}</div>
      ${DefaultMenuCheckbox({
        label: 'Loop',
        storageKey: 'vds-player::user-loop',
        onChange(checked, trigger) {
          remote.userPrefersLoopChange(checked, trigger);
        },
      })}
    </div>
  `;
}

function DefaultAccessibilityMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext();
    return html`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${renderMenuButton({
          label: () => i18n(translations, 'Accessibility'),
          icon: 'menu-accessibility',
        })}
        <media-menu-items class="vds-menu-items">
          ${[DefaultMenuKeyboardAnimationCheckbox(), DefaultFontMenu()]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultMenuKeyboardAnimationCheckbox() {
  return $signal(() => {
    const { translations, userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
      { viewType } = useMediaState(),
      $disabled = computed(() => viewType() !== 'video');

    if ($disabled()) return null;

    const label = 'Keyboard Animations',
      $label = $i18n(translations, label);

    return html`
      <div class="vds-menu-item vds-menu-item-checkbox">
        <div class="vds-menu-checkbox-label">${$label}</div>
        ${DefaultMenuCheckbox({
          label,
          defaultChecked: true,
          storageKey: 'vds-player::keyboard-animations',
          onChange(checked) {
            userPrefersKeyboardAnimations.set(checked);
          },
        })}
      </div>
    `;
  });
}

function DefaultMenuCheckbox({
  label,
  defaultChecked = false,
  storageKey,
  onChange,
}: {
  label: DefaultLayoutWord;
  storageKey?: string;
  defaultChecked?: boolean;
  onChange(checked: boolean, trigger?: Event): void;
}) {
  const { translations } = useDefaultLayoutContext(),
    savedValue = storageKey ? localStorage.getItem(storageKey) : null,
    $checked = signal(!!(savedValue ?? defaultChecked)),
    $active = signal(false),
    $ariaChecked = $signal($ariaBool($checked)),
    $label = $i18n(translations, label);

  onChange(peek($checked));

  function onPress(event?: PointerEvent) {
    if (event?.button === 1) return;
    $checked.set((checked) => !checked);
    if (storageKey) localStorage.setItem(storageKey, $checked() ? '1' : '');
    onChange($checked(), event);
    $active.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (isKeyboardClick(event)) onPress();
  }

  function onActive(event: PointerEvent) {
    if (event.button !== 0) return;
    $active.set(true);
  }

  return html`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${$label}
      aria-checked=${$ariaChecked}
      data-active=${$signal(() => ($active() ? '' : null))}
      @pointerup=${onPress}
      @pointerdown=${onActive}
      @keydown=${onKeyDown}
    ></div>
  `;
}

function DefaultAudioMenu() {
  return $signal(() => {
    const { noAudioGainSlider, translations } = useDefaultLayoutContext(),
      { audioTracks, canSetAudioGain } = useMediaState(),
      $disabled = computed(() => {
        const hasGainSlider = canSetAudioGain() && !noAudioGainSlider();
        return !hasGainSlider && audioTracks().length <= 1;
      });

    if ($disabled()) return null;

    return html`
      <media-menu class="vds-audio-tracks-menu vds-menu">
        ${renderMenuButton({
          label: () => i18n(translations, 'Audio'),
          icon: 'menu-audio',
        })}
        <media-menu-items class="vds-menu-items">
          ${[DefaultMenuAudioGainSlider(), DefaultAudioTracksMenu()]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultAudioTracksMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext(),
      { audioTracks } = useMediaState(),
      $defaultText = $i18n(translations, 'Default'),
      $disabled = computed(() => audioTracks().length <= 1);

    if ($disabled()) return null;

    return html`
      <media-menu class="vds-audio-track-menu vds-menu">
        ${renderMenuButton({
          label: () => i18n(translations, 'Audio Track'),
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
  });
}

function DefaultMenuAudioGainSlider() {
  return $signal(() => {
    const { noAudioGainSlider, translations } = useDefaultLayoutContext(),
      { canSetAudioGain } = useMediaState(),
      $disabled = computed(() => !canSetAudioGain() || noAudioGainSlider());

    if ($disabled()) return null;

    const { audioGain } = useMediaState(),
      $label = $i18n(translations, 'Audio Boost'),
      $value = $signal(() => Math.round(((audioGain() ?? 1) - 1) * 100) + '%');

    return html`
      <div class="vds-menu-item vds-menu-item-slider">
        <div class="vds-menu-slider-title">
          <span class="vds-menu-slider-label">${$label}</span>
          <span class="vds-menu-slider-value">${$value}</span>
        </div>
        <div class="vds-menu-slider-group">
          <slot name="volume-low-icon"></slot>
          ${DefaultAudioGainSlider()}
          <slot name="volume-high-icon"></slot>
        </div>
      </div>
    `;
  });
}

function DefaultAudioGainSlider() {
  const { translations, maxAudioGain } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Audio Boost'),
    $maxAudioGain = $signal(maxAudioGain);
  return html`
    <media-audio-gain-slider
      class="vds-audio-gain-slider vds-slider"
      aria-label=${$label}
      max=${$maxAudioGain}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <div class="vds-slider-thumb"></div>
    </media-audio-gain-slider>
  `;
}

function DefaultSpeedMenu() {
  return $signal(() => {
    const { translations, playbackRates } = useDefaultLayoutContext(),
      { $provider } = useMediaContext(),
      $normalText = $i18n(translations, 'Normal'),
      $disabled = computed(() => !$provider()?.setPlaybackRate || playbackRates().length === 0);

    if ($disabled()) return null;

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
            .rates=${$signal(playbackRates)}
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
  });
}

function DefaultQualityMenu() {
  const { translations } = useDefaultLayoutContext(),
    $autoText = $i18n(translations, 'Auto'),
    { canSetQuality, qualities } = useMediaState(),
    $disabled = computed(() => !canSetQuality() || qualities().length === 0);

  if ($disabled()) return null;

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
  return $signal(() => {
    const { translations } = useDefaultLayoutContext(),
      { hasCaptions } = useMediaState(),
      $offText = $i18n(translations, 'Off');

    if (!hasCaptions()) return null;

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
  });
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
