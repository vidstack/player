import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { computed, signal, type ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import chaptersIconPaths from 'media-icons/dist/icons/chapters.js';
import ccOnIconPaths from 'media-icons/dist/icons/closed-captions-on.js';
import ccIconPaths from 'media-icons/dist/icons/closed-captions.js';
import exitFullscreenIconPaths from 'media-icons/dist/icons/fullscreen-exit.js';
import enterFullscreenIconPaths from 'media-icons/dist/icons/fullscreen.js';
import musicIconPaths from 'media-icons/dist/icons/music.js';
import muteIconPaths from 'media-icons/dist/icons/mute.js';
import odometerIconPaths from 'media-icons/dist/icons/odometer.js';
import pauseIconPaths from 'media-icons/dist/icons/pause.js';
import exitPIPIconPaths from 'media-icons/dist/icons/picture-in-picture-exit.js';
import enterPIPIconPaths from 'media-icons/dist/icons/picture-in-picture.js';
import playIconPaths from 'media-icons/dist/icons/play.js';
import replayIconPaths from 'media-icons/dist/icons/replay.js';
import seekBackward10IconPaths from 'media-icons/dist/icons/seek-backward-10.js';
import seekForward10IconPaths from 'media-icons/dist/icons/seek-forward-10.js';
import qualityIconPaths from 'media-icons/dist/icons/settings-menu.js';
import settingsIconPaths from 'media-icons/dist/icons/settings.js';
import volumeHighIconPaths from 'media-icons/dist/icons/volume-high.js';
import volumeLowIconPaths from 'media-icons/dist/icons/volume-low.js';

import {
  i18n,
  useDefaultSkinContext,
  type DefaultSkinTranslations,
  type MenuPlacement,
  type TooltipPlacement,
} from '../../../../components';
import { observeActiveTextTrack } from '../../../../core';
import { useMediaContext } from '../../../../core/api/media-context';
import { Icon } from '../../../icon';
import { $signal } from '../../../lit/directives/signal';
import { renderMenuButton } from './menu-ui';

function $i18n(
  translations: ReadSignal<DefaultSkinTranslations | null>,
  key: keyof DefaultSkinTranslations,
) {
  return $signal(computed(() => i18n(translations, key)));
}

export function PlayButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultSkinContext(),
    PlayIcon = Icon({ paths: playIconPaths, state: 'play' }),
    PauseIcon = Icon({ paths: pauseIconPaths, state: 'pause' }),
    ReplayIcon = Icon({ paths: replayIconPaths, state: 'replay' });
  return html`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button class="vds-play-button vds-button">
          ${PlayIcon}${PauseIcon}${ReplayIcon}
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="play">${$i18n(translations, 'Play')}</span>
        <span data-state="pause">${$i18n(translations, 'Pause')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function MuteButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultSkinContext(),
    MuteIcon = Icon({ paths: muteIconPaths, state: 'volume-mute' }),
    VolumeLowIcon = Icon({ paths: volumeLowIconPaths, state: 'volume-low' }),
    VolumeHighIcon = Icon({ paths: volumeHighIconPaths, state: 'volume-high' });
  return html`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button class="vds-mute-button vds-button">
          ${MuteIcon}${VolumeLowIcon}${VolumeHighIcon}
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="mute">${$i18n(translations, 'Mute')}</span>
        <span data-state="unmute">${$i18n(translations, 'Unmute')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function CaptionButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultSkinContext(),
    OnIcon = Icon({ paths: ccOnIconPaths, state: 'on' }),
    OffIcon = Icon({ paths: ccIconPaths, state: 'off' });
  return html`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button class="vds-caption-button vds-button">
          ${OnIcon}${OffIcon}
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="on">${$i18n(translations, 'Closed-Captions On')}</span>
        <span data-state="off">${$i18n(translations, 'Closed-Captions Off')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function PiPButton() {
  const { translations } = useDefaultSkinContext(),
    EnterIcon = Icon({ paths: enterPIPIconPaths, state: 'enter' }),
    ExitIcon = Icon({ paths: exitPIPIconPaths, state: 'exit' });
  return html`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button class="vds-pip-button vds-button">
          ${EnterIcon}${ExitIcon}
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span data-state="enter">${$i18n(translations, 'Enter PiP')}</span>
        <span data-state="exit">${$i18n(translations, 'Exit PiP')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function FullscreenButton({ tooltip }: { tooltip: TooltipPlacement }) {
  const { translations } = useDefaultSkinContext(),
    EnterIcon = Icon({ paths: enterFullscreenIconPaths, state: 'enter' }),
    ExitIcon = Icon({ paths: exitFullscreenIconPaths, state: 'exit' });
  return html`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button class="vds-fullscreen-button vds-button">
          ${EnterIcon}${ExitIcon}
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span data-state="enter">${$i18n(translations, 'Enter Fullscreen')}</span>
        <span data-state="exit">${$i18n(translations, 'Exit Fullscreen')}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function SeekButton({ seconds, tooltip }: { seconds: number; tooltip: TooltipPlacement }) {
  const { translations } = useDefaultSkinContext();
  return html`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button class="vds-seek-button vds-button" seconds=${seconds}>
          ${Icon({ paths: seconds >= 0 ? seekForward10IconPaths : seekBackward10IconPaths })}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seconds >= 0 ? 'Seek Forward' : 'Seek Backward')}
      </media-tooltip-content>
    </media-tooltip>
  `;
}

export function VolumeSlider() {
  return html`
    <media-volume-slider class="vds-volume-slider vds-slider">
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" overflow>
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

export function MainTitle() {
  const {
    $state: { title },
  } = useMediaContext();
  return html`<span class="vds-media-title">${$signal(title)}</span>`;
}

export function ChapterTitle() {
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

export function TimeSlider() {
  return html`
    <media-time-slider class="vds-time-slider vds-slider">
      <div class="vds-slider-chapters">
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </div>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail class="vds-slider-thumbnail vds-thumbnail"></media-slider-thumbnail>
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

export function TimeGroup() {
  return html`
    <div class="vds-time-group">
      <media-time class="vds-time" type="current"></media-time>
      <div class="vds-time-divider">/</div>
      <media-time class="vds-time" type="duration"></media-time>
    </div>
  `;
}

export function ChaptersMenu({
  placement,
  tooltip,
}: {
  placement?: MenuPlacement;
  tooltip: TooltipPlacement;
}) {
  const { translations } = useDefaultSkinContext();
  return html`
    <!-- Chapters Menu -->
    <media-menu class="vds-chapters-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button class="vds-menu-button vds-button">
            ${Icon({ paths: chaptersIconPaths })}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
          ${$i18n(translations, 'Chapters')}
        </media-tooltip-content>
      </media-tooltip>
      <media-menu-portal>
        <media-menu-items
          class="vds-chapters-menu-items vds-menu-items"
          placement=${ifDefined(placement)}
        >
          <media-chapters-radio-group class="vds-chapters-radio-group vds-radio-group">
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

export function SettingsMenu({
  placement,
  tooltip,
}: {
  placement?: MenuPlacement;
  tooltip: TooltipPlacement;
}) {
  const { translations } = useDefaultSkinContext();
  return html`
    <media-menu class="vds-settings-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button class="vds-menu-button vds-button">
            ${Icon({ paths: settingsIconPaths, class: 'vds-rotate-icon' })}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
          ${$i18n(translations, 'Settings')}
        </media-tooltip-content>
      </media-tooltip>
      <media-menu-portal>
        <media-menu-items
          class="vds-settings-menu-items vds-menu-items"
          placement=${ifDefined(placement)}
        >
          ${AudioMenu()}${SpeedMenu()}${QualityMenu()}${CaptionsMenu()}
        </media-menu-items>
      </media-menu-portal>
    </media-menu>
  `;
}

function AudioMenu() {
  const { translations } = useDefaultSkinContext();
  return html`
    <!-- Audio Menu -->
    <media-menu class="vds-audio-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Audio'),
        iconPaths: musicIconPaths,
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

function SpeedMenu() {
  const { translations } = useDefaultSkinContext();
  return html`
    <!-- Speed Menu -->
    <media-menu class="vds-speed-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Speed'),
        iconPaths: odometerIconPaths,
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

function QualityMenu() {
  const { translations } = useDefaultSkinContext();
  return html`
    <!-- Quality Menu -->
    <media-menu class="vds-quality-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Quality'),
        iconPaths: qualityIconPaths,
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

function CaptionsMenu() {
  const { translations } = useDefaultSkinContext();
  return html`
    <!-- Captions Menu -->
    <media-menu class="vds-captions-menu vds-menu">
      ${renderMenuButton({
        label: () => i18n(translations, 'Captions'),
        iconPaths: ccIconPaths,
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
