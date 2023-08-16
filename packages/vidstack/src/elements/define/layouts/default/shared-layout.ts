import { html } from 'lit-html';
import { computed, signal, type ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import {
  useDefaultLayoutContext,
  useDefaultLayoutLang,
  type DefaultLayoutTranslations,
  type MenuPlacement,
  type TooltipPlacement,
} from '../../../../components';
import { observeActiveTextTrack } from '../../../../core';
import { useMediaContext } from '../../../../core/api/media-context';
import { $signal } from '../../../lit/directives/signal';
import { renderMenuButton } from './menu-layout';

function $i18n(
  translations: ReadSignal<DefaultLayoutTranslations | null>,
  key: keyof DefaultLayoutTranslations,
) {
  return $signal(computed(() => useDefaultLayoutLang(translations, key)));
}

export function DefaultPlayButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button class="vds-play-button vds-button">
          <slot name="play-icon" data-state="play"></slot>
          <slot name="pause-icon" data-state="pause"></slot>
          <slot name="replay-icon" data-state="replay"></slot>
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="play">${$i18n(translations, 'Play')}</span>
        <span data-state="pause">${$i18n(translations, 'Pause')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultMuteButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button class="vds-mute-button vds-button">
          <slot name="mute-icon" data-state="mute"></slot>
          <slot name="volume-low-icon" data-state="volume-low"></slot>
          <slot name="volume-high-icon" data-state="volume-high"></slot>
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="mute">${$i18n(translations, 'Unmute')}</span>
        <span data-state="unmute">${$i18n(translations, 'Mute')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultCaptionButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button class="vds-caption-button vds-button">
          <slot name="cc-on-icon" data-state="on"></slot>
          <slot name="cc-off-icon" data-state="off"></slot>
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="on">${$i18n(translations, 'Closed-Captions Off')}</span>
        <span data-state="off">${$i18n(translations, 'Closed-Captions On')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultPIPButton() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button class="vds-pip-button vds-button">
          <slot name="pip-enter-icon" data-state="enter"></slot>
          <slot name="pip-exit-icon" data-state="exit"></slot>
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span data-state="enter">${$i18n(translations, 'Enter PiP')}</span>
        <span data-state="exit">${$i18n(translations, 'Exit PiP')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultFullscreenButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button class="vds-fullscreen-button vds-button">
          <slot name="fs-enter-icon" data-state="enter"></slot>
          <slot name="fs-exit-icon" data-state="exit"></slot>
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="enter">${$i18n(translations, 'Enter Fullscreen')}</span>
        <span data-state="exit">${$i18n(translations, 'Exit Fullscreen')}</span>
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
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button class="vds-seek-button vds-button" seconds=${seconds}>
          ${seconds >= 0
            ? html`<slot name="seek-forward-icon"></slot>`
            : html`<slot name="seek-backward-icon"></slot>`}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seconds >= 0 ? 'Seek Forward' : 'Seek Backward')}
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function DefaultVolumeSlider() {
  return html`
    <media-volume-slider class="vds-volume-slider vds-slider">
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value
          class="vds-slider-value"
          type="pointer"
          format="percent"
        ></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `;
}

export function DefaultMainTitle() {
  const {
    $state: { title },
  } = useMediaContext();
  return html`<span class="vds-media-title">${$signal(title)}</span>`;
}

export function DefaultChapterTitle() {
  const {
    textTracks,
    $state: { title, started },
  } = useMediaContext();

  const chapterTitle = signal(''),
    mainTitle = computed(() => (started() ? chapterTitle() || title() : title()));

  observeActiveTextTrack(textTracks, 'chapters', (track) => {
    if (!track) {
      chapterTitle.set('');
      return;
    }

    function onCueChange() {
      const activeCue = track?.activeCues[0];
      chapterTitle.set(activeCue?.text || '');
    }

    onCueChange();
    listenEvent(track, 'cue-change', onCueChange);
  });

  return html`<span class="vds-media-title">${$signal(mainTitle)}</span>`;
}

export function DefaultTimeSlider() {
  const { smQueryList, thumbnails } = useDefaultLayoutContext();
  return html`
    <media-time-slider class="vds-time-slider vds-slider">
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$signal(smQueryList.$matches)}>
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
        <media-slider-value
          class="vds-slider-value"
          type="pointer"
          format="time"
        ></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
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

export function DefaultChaptersMenu({
  placement,
  tooltip,
}: {
  placement?: MenuPlacement;
  tooltip: TooltipPlacement;
}) {
  const { translations, smQueryList, thumbnails, menuContainer } = useDefaultLayoutContext(),
    $placement = computed(() => (smQueryList.matches ? null : placement));
  return html`
    <!-- Chapters Menu -->
    <media-menu class="vds-chapters-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button class="vds-menu-button vds-button">
            <slot name="chapters-icon"></slot>
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
          ${$i18n(translations, 'Chapters')}
        </media-tooltip-content>
      </media-tooltip>
      <media-menu-portal .container=${menuContainer} disabled="fullscreen">
        <media-menu-items
          class="vds-chapters-menu-items vds-menu-items"
          placement=${$signal($placement)}
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
      </media-menu-portal>
    </media-menu>
  `;
}

export function DefaultSettingsMenu({
  placement,
  tooltip,
}: {
  tooltip: TooltipPlacement;
  placement?: MenuPlacement;
}) {
  const { translations, smQueryList, menuContainer } = useDefaultLayoutContext(),
    $placement = computed(() => (smQueryList.matches ? null : placement));
  return html`
    <media-menu class="vds-settings-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button class="vds-menu-button vds-button">
            <slot name="settings-icon" data-class="vds-rotate-icon"></slot>
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
          ${$i18n(translations, 'Settings')}
        </media-tooltip-content>
      </media-tooltip>
      <media-menu-portal .container=${menuContainer} disabled="fullscreen">
        <media-menu-items
          class="vds-settings-menu-items vds-menu-items"
          placement=${$signal($placement)}
        >
          ${DefaultAudioSubmenu()}${DefaultSpeedSubmenu()}${DefaultQualitySubmenu()}${DefaultCaptionsSubmenu()}
        </media-menu-items>
      </media-menu-portal>
    </media-menu>
  `;
}

function DefaultAudioSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <!-- Audio Menu -->
    <media-menu class="vds-audio-menu vds-menu">
      ${renderMenuButton({
        label: () => useDefaultLayoutLang(translations, 'Audio'),
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
        label: () => useDefaultLayoutLang(translations, 'Speed'),
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
        label: () => useDefaultLayoutLang(translations, 'Quality'),
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
        label: () => useDefaultLayoutLang(translations, 'Captions'),
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
