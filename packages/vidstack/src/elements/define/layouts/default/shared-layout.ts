import { html, type TemplateResult } from 'lit-html';
import { computed, type ReadSignal } from 'maverick.js';
import { isFunction, unwrap } from 'maverick.js/std';

import { isTrackCaptionKind } from '../../../..';
import {
  getDefaultLayoutLang,
  useDefaultLayoutContext,
  type DefaultLayoutTranslations,
  type MenuPlacement,
  type TooltipPlacement,
} from '../../../../components';
import { useMediaContext } from '../../../../core/api/media-context';
import { $computed, $signal } from '../../../lit/directives/signal';
import { renderMenuButton } from './menu-layout';

function $i18n(
  translations: ReadSignal<DefaultLayoutTranslations | null>,
  key: keyof DefaultLayoutTranslations,
) {
  return $computed(() => getDefaultLayoutLang(translations, key));
}

export function DefaultPlayButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { paused } = useMediaContext().$state,
    $label = $computed(() => getDefaultLayoutLang(translations, paused() ? 'Play' : 'Pause'));
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
        <span class="vds-play-tooltip-text">${$i18n(translations, 'Play')}</span>
        <span class="vds-pause-tooltip-text">${$i18n(translations, 'Pause')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultMuteButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { muted } = useMediaContext().$state,
    $label = $computed(() => getDefaultLayoutLang(translations, muted() ? 'Unmute' : 'Unmute'));
  return html`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button class="vds-mute-button vds-button" aria-label=${$label}>
          <slot name="mute-icon" data-class="vds-mute-icon"></slot>
          <slot name="volume-low-icon" data-class="vds-volume-low-icon"></slot>
          <slot name="volume-high-icon" data-class="vds-volume-high-icon"></slot>
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-mute-tooltip-text">${$i18n(translations, 'Unmute')}</span>
        <span class="vds-unmute-tooltip-text">${$i18n(translations, 'Mute')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultCaptionButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { textTrack } = useMediaContext().$state,
    $label = $computed(() =>
      getDefaultLayoutLang(
        translations,
        textTrack() ? 'Closed-Captions Off' : 'Closed-Captions On',
      ),
    );
  return html`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button class="vds-caption-button vds-button" aria-label=${$label}>
          <slot name="cc-on-icon" data-class="vds-cc-on-icon"></slot>
          <slot name="cc-off-icon" data-class="vds-cc-off-icon"></slot>
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-cc-on-tooltip-text">${$i18n(translations, 'Closed-Captions Off')}</span>
        <span class="vds-cc-off-tooltip-text">${$i18n(translations, 'Closed-Captions On')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultPIPButton() {
  const { translations } = useDefaultLayoutContext(),
    { pictureInPicture } = useMediaContext().$state,
    $label = $computed(() =>
      getDefaultLayoutLang(translations, pictureInPicture() ? 'Exit PiP' : 'Enter PiP'),
    );
  return html`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button class="vds-pip-button vds-button" aria-label=${$label}>
          <slot name="pip-enter-icon" data-class="vds-pip-enter-icon"></slot>
          <slot name="pip-exit-icon" data-class="vds-pip-exit-icon"></slot>
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${$i18n(translations, 'Enter PiP')}</span>
        <span class="vds-pip-exit-tooltip-text">${$i18n(translations, 'Exit PiP')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultFullscreenButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext(),
    { fullscreen } = useMediaContext().$state,
    $label = $computed(() =>
      getDefaultLayoutLang(translations, fullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen'),
    );
  return html`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button class="vds-fullscreen-button vds-button" aria-label=${$label}>
          <slot name="fs-enter-icon" data-class="vds-fs-enter-icon"></slot>
          <slot name="fs-exit-icon" data-class="vds-fs-exit-icon"></slot>
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-fs-enter-tooltip-text">${$i18n(translations, 'Enter Fullscreen')}</span>
        <span class="vds-fs-exit-tooltip-text">${$i18n(translations, 'Exit Fullscreen')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultSeekButton({
  seconds,
  tooltip,
}: {
  seconds: number;
  tooltip: TooltipPlacement;
}) {
  const { translations } = useDefaultLayoutContext(),
    seekText = seconds >= 0 ? 'Seek Forward' : 'Seek Backward',
    $label = $i18n(translations, seekText);
  return html`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${seconds}
          aria-label=${$label}
        >
          ${seconds >= 0
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

export function DefaultVolumeSlider() {
  const { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Volume');
  return html`
    <media-volume-slider class="vds-volume-slider vds-slider" aria-label=${$label}>
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
  const { width } = useMediaContext().$state,
    { thumbnails, translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Seek');
  return html`
    <media-time-slider class="vds-time-slider vds-slider" aria-label=${$label}>
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$signal(() => width() < 768)}>
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
          src=${$signal(thumbnails)}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
}

export function DefaultLiveButton() {
  const { translations } = useDefaultLayoutContext(),
    { live } = useMediaContext().$state,
    $label = $i18n(translations, 'Skip To Live'),
    $liveText = $i18n(translations, 'LIVE');
  return live()
    ? html`
    <media-live-button class="vds-live-button" aria-label=${$label}>
      <span class="vds-live-button-text">${$liveText}</span>
    </media-live-button
  `
    : null;
}

export function DefaultTimeGroup() {
  return html`
    <div class="vds-time-group">
      <media-time class="vds-time" type="current"></media-time>
      <div class="vds-time-divider">/</div>
      <media-time class="vds-time" type="duration"></media-time>
    </div>
  `;
}

export function DefaultTimeInfo(): any {
  const { live } = useMediaContext().$state;
  return live() ? DefaultLiveButton() : DefaultTimeGroup();
}

function MenuPortal(container: HTMLElement | null, template: TemplateResult) {
  return html`
    <media-menu-portal .container=${container} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
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
  const { viewType } = useMediaContext().$state,
    { translations, smQueryList, thumbnails, menuContainer, noModal, menuGroup } =
      useDefaultLayoutContext(),
    $placement = computed(() =>
      noModal() ? unwrap(placement) : !smQueryList.matches ? unwrap(placement) : null,
    ),
    $offset = computed(() =>
      !smQueryList.matches && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
    );

  const items = html`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      <media-chapters-radio-group
        class="vds-chapters-radio-group vds-radio-group"
        thumbnails=${$signal(thumbnails)}
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
    <!-- Chapters Menu -->
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
  const { viewType, canSetPlaybackRate, canSetQuality, qualities, audioTracks, textTracks } =
      useMediaContext().$state,
    { translations, smQueryList, menuContainer, noModal, menuGroup } = useDefaultLayoutContext(),
    $placement = computed(() =>
      noModal() ? unwrap(placement) : !smQueryList.matches ? unwrap(placement) : null,
    ),
    $offset = computed(() =>
      !smQueryList.matches && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
    ),
    $hasMenuItems = computed(
      () =>
        canSetPlaybackRate() ||
        (canSetQuality() && qualities().length) ||
        audioTracks().length ||
        textTracks().filter(isTrackCaptionKind).length,
    );

  const items = html`
    <media-menu-items
      class="vds-settings-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      ${DefaultAudioSubmenu()}${DefaultSpeedSubmenu()}${DefaultQualitySubmenu()}${DefaultCaptionsSubmenu()}
    </media-menu-items>
  `;

  const menu = html`
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

  return $computed(() => ($hasMenuItems() ? menu : null)) as any;
}

function DefaultAudioSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <!-- Audio Menu -->
    <media-menu class="vds-audio-menu vds-menu">
      ${renderMenuButton({
        label: () => getDefaultLayoutLang(translations, 'Audio'),
        icon: 'menu-audio',
      })}
      <media-menu-items class="vds-menu-items">
        <media-audio-radio-group
          class="vds-audio-radio-group vds-radio-group"
          empty-label=${$i18n(translations, 'Default')}
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

function DefaultSpeedSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <!-- Speed Menu -->
    <media-menu class="vds-speed-menu vds-menu">
      ${renderMenuButton({
        label: () => getDefaultLayoutLang(translations, 'Speed'),
        icon: 'menu-speed',
      })}
      <media-menu-items class="vds-menu-items">
        <media-speed-radio-group
          class="vds-speed-radio-group vds-radio-group"
          normal-label=${$i18n(translations, 'Normal')}
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

function DefaultQualitySubmenu() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <!-- Quality Menu -->
    <media-menu class="vds-quality-menu vds-menu">
      ${renderMenuButton({
        label: () => getDefaultLayoutLang(translations, 'Quality'),
        icon: 'menu-quality',
      })}
      <media-menu-items class="vds-menu-items">
        <media-quality-radio-group
          class="vds-quality-radio-group vds-radio-group"
          auto-label=${$i18n(translations, 'Auto')}
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

function DefaultCaptionsSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <!-- Captions Menu -->
    <media-menu class="vds-captions-menu vds-menu">
      ${renderMenuButton({
        label: () => getDefaultLayoutLang(translations, 'Captions'),
        icon: 'menu-captions',
      })}
      <media-menu-items class="vds-menu-items">
        <media-captions-radio-group
          class="vds-captions-radio-group vds-radio-group"
          off-label=${$i18n(translations, 'Off')}
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
