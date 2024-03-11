import { html, type TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { computed, effect, peek, signal, type ReadSignal } from 'maverick.js';
import { isKeyboardClick, isKeyboardEvent, listenEvent } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import {
  usePlyrLayoutContext,
  type PlyrLayoutContext,
} from '../../../../components/layouts/plyr/context';
import type { PlyrControl, PlyrMarker } from '../../../../components/layouts/plyr/props';
import { i18n, type PlyrLayoutWord } from '../../../../components/layouts/plyr/translations';
import { useMediaContext } from '../../../../core/api/media-context';
import type { MediaSeekingRequestEvent } from '../../../../core/api/media-request-events';
import { getDownloadFile } from '../../../../utils/network';
import { $signal } from '../../../lit/directives/signal';

export function PlyrAudioLayout() {
  return AudioControls();
}

export function PlyrVideoLayout() {
  const media = useMediaContext(),
    { load } = media.$props,
    { canLoad } = media.$state,
    showLoadScreen = computed(() => load() === 'play' && !canLoad());

  if (showLoadScreen()) {
    return [PlayLargeButton(), Poster()];
  }

  return [
    OptionalPlayLarge(),
    PreviewScrubbing(),
    Poster(),
    VideoControls(),
    Gestures(),
    Captions(),
  ];
}

function PlayLargeButton() {
  const media = useMediaContext(),
    { translations } = usePlyrLayoutContext(),
    { title } = media.$state,
    $label = $signal(() => `${i18n(translations, 'Play')}, ${title()}`);
  return html`
    <media-play-button
      class="plyr__control plyr__control--overlaid"
      aria-label=${$label}
      data-plyr="play"
    >
      <slot name="play-icon"></slot>
    </button>
  `;
}

function OptionalPlayLarge() {
  const { controls } = usePlyrLayoutContext();
  return $signal(() => (controls().includes('play-large') ? PlayLargeButton() : null));
}

function PreviewScrubbing() {
  const { thumbnails, previewTime } = usePlyrLayoutContext();
  return html`
    <media-thumbnail
      .src=${$signal(thumbnails)}
      class="plyr__preview-scrubbing"
      time=${$signal(() => previewTime())}
    ></media-thumbnail>
  `;
}

function Poster() {
  const media = useMediaContext(),
    { poster } = media.$state,
    $style = $signal(() => `background-image: url("${poster()}");`);
  return html`<div class="plyr__poster" style=${$style}></div>`;
}

function AudioControls() {
  const ignore = new Set<PlyrControl>(['captions', 'pip', 'airplay', 'fullscreen']),
    { controls } = usePlyrLayoutContext(),
    $controls = $signal(() =>
      controls()
        .filter((type) => !ignore.has(type))
        .map(Control),
    );

  return html`<div class="plyr__controls">${$controls}</div>`;
}

function VideoControls() {
  const { controls } = usePlyrLayoutContext(),
    $controls = $signal(() => controls().map(Control));
  return html`<div class="plyr__controls">${$controls}</div>`;
}

function Control(type: PlyrControl) {
  switch (type) {
    case 'airplay':
      return AirPlayButton();
    case 'captions':
      return CaptionsButton();
    case 'current-time':
      return CurrentTime();
    case 'download':
      return DownloadButton();
    case 'duration':
      return Duration();
    case 'fast-forward':
      return FastForwardButton();
    case 'fullscreen':
      return FullscreenButton();
    case 'mute':
    case 'volume':
    case 'mute+volume':
      return Volume(type);
    case 'pip':
      return PIPButton();
    case 'play':
      return PlayButton();
    case 'progress':
      return TimeSlider();
    case 'restart':
      return RestartButton();
    case 'rewind':
      return RewindButton();
    case 'settings':
      return Settings();
    default:
      return null;
  }
}

function AirPlayButton() {
  const { translations } = usePlyrLayoutContext();
  return html`
    <media-airplay-button class="plyr__controls__item plyr__control" data-plyr="airplay">
      <slot name="airplay-icon"></slot>
      <span class="plyr__tooltip">${$i18n(translations, 'AirPlay')}</span>
    </media-airplay-button>
  `;
}

function CaptionsButton() {
  const { translations } = usePlyrLayoutContext(),
    $disableText = $i18n(translations, 'Disable captions'),
    $enableText = $i18n(translations, 'Enable captions');
  return html`
    <media-caption-button
      class="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="captions"
    >
      <slot name="captions-on-icon" data-class="icon--pressed"></slot>
      <slot name="captions-off-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${$disableText}</span>
      <span class="label--not-pressed plyr__tooltip">${$enableText}</span>
    </media-caption-button>
  `;
}

function FullscreenButton() {
  const { translations } = usePlyrLayoutContext(),
    $enterText = $i18n(translations, 'Enter Fullscreen'),
    $exitText = $i18n(translations, 'Exit Fullscreen');
  return html`
    <media-fullscreen-button
      class="plyr__controls__item plyr__control"
      data-no-label
      data-plyr="fullscreen"
    >
      <slot name="enter-fullscreen-icon" data-class="icon--pressed"></slot>
      <slot name="exit-fullscreen-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${$exitText}</span>
      <span class="label--not-pressed plyr__tooltip">${$enterText}</span>
    </media-fullscreen-button>
  `;
}

function MuteButton() {
  const { translations } = usePlyrLayoutContext(),
    $muteText = $i18n(translations, 'Mute'),
    $unmuteText = $i18n(translations, 'Unmute');
  return html`
    <media-mute-button class="plyr__control" data-no-label data-plyr="mute">
      <slot name="muted-icon" data-class="icon--pressed"></slot>
      <slot name="volume-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${$unmuteText}</span>
      <span class="label--not-pressed plyr__tooltip">${$muteText}</span>
    </media-mute-button>
  `;
}

function PIPButton() {
  const { translations } = usePlyrLayoutContext(),
    $enterText = $i18n(translations, 'Enter PiP'),
    $exitText = $i18n(translations, 'Exit PiP');
  return html`
    <media-pip-button class="plyr__controls__item plyr__control" data-no-label data-plyr="pip">
      <slot name="enter-pip-icon" data-class="icon--pressed"></slot>
      <slot name="exit-pip-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${$exitText}</span>
      <span class="label--not-pressed plyr__tooltip">${$enterText}</span>
    </media-pip-button>
  `;
}

function PlayButton() {
  const { translations } = usePlyrLayoutContext(),
    $playText = $i18n(translations, 'Play'),
    $pauseText = $i18n(translations, 'Pause');
  return html`
    <media-play-button class="plyr__controls__item plyr__control" data-no-label data-plyr="play">
      <slot name="pause-icon" data-class="icon--pressed"></slot>
      <slot name="play-icon" data-class="icon--not-pressed"></slot>
      <span class="label--pressed plyr__tooltip">${$pauseText}</span>
      <span class="label--not-pressed plyr__tooltip">${$playText}</span>
    </media-play-button>
  `;
}

function RestartButton() {
  const { translations } = usePlyrLayoutContext(),
    { remote } = useMediaContext(),
    $restartText = $i18n(translations, 'Restart');

  function onPress(event: Event) {
    if (isKeyboardEvent(event) && !isKeyboardClick(event)) return;
    remote.seek(0, event);
  }

  return html`
    <button
      type="button"
      class="plyr__control"
      data-plyr="restart"
      @pointerup=${onPress}
      @keydown=${onPress}
    >
      <slot name="restart-icon"></slot>
      <span class="plyr__tooltip">${$restartText}</span>
    </button>
  `;
}

function RewindButton() {
  const { translations, seekTime } = usePlyrLayoutContext(),
    $label = $signal(() => `${i18n(translations, 'Rewind')} ${seekTime()}s`),
    $seconds = $signal(() => -1 * seekTime());
  return html`
    <media-seek-button
      class="plyr__controls__item plyr__control"
      seconds=${$seconds}
      data-no-label
      data-plyr="rewind"
    >
      <slot name="rewind-icon"></slot>
      <span class="plyr__tooltip">${$label}</span>
    </media-seek-button>
  `;
}

function FastForwardButton() {
  const { translations, seekTime } = usePlyrLayoutContext(),
    $label = $signal(() => `${i18n(translations, 'Forward')} ${seekTime()}s`),
    $seconds = $signal(seekTime);
  return html`
    <media-seek-button
      class="plyr__controls__item plyr__control"
      seconds=${$seconds}
      data-no-label
      data-plyr="fast-forward"
    >
      <slot name="fast-forward-icon"></slot>
      <span class="plyr__tooltip">${$label}</span>
    </media-seek-button>
  `;
}

function TimeSlider() {
  let media = useMediaContext(),
    { duration, viewType } = media.$state,
    { translations, markers, thumbnails, seekTime, previewTime } = usePlyrLayoutContext(),
    $seekText = $i18n(translations, 'Seek'),
    activeMarker = signal<PlyrMarker | null>(null),
    $markerLabel = $signal(() => {
      const marker = activeMarker();
      return marker
        ? html`<span class="plyr__progress__marker-label">${unsafeHTML(marker.label)}<br /></span>`
        : null;
    });

  function onSeekingRequest(event: MediaSeekingRequestEvent) {
    previewTime.set(event.detail);
  }

  function onMarkerEnter(this: PlyrMarker) {
    activeMarker.set(this);
  }

  function onMarkerLeave() {
    activeMarker.set(null);
  }

  function Preview() {
    const src = thumbnails(),
      $noClamp = $signal(() => viewType() === 'audio');

    return !src
      ? html`
          <span class="plyr__tooltip">
            ${$markerLabel}
            <media-slider-value></media-slider-value>
          </span>
        `
      : html`
          <media-slider-preview class="plyr__slider__preview" ?no-clamp=${$noClamp}>
            <media-slider-thumbnail .src=${src} class="plyr__slider__preview__thumbnail">
              <span class="plyr__slider__preview__time-container">
                ${$markerLabel}
                <media-slider-value class="plyr__slider__preview__time"></media-slider-value>
              </span>
            </media-slider-thumbnail>
          </media-slider-preview>
        `;
  }

  function Markers() {
    const endTime = duration();

    if (!Number.isFinite(endTime)) return null;

    return markers()?.map(
      (marker) => html`
        <span
          class="plyr__progress__marker"
          @mouseenter=${onMarkerEnter.bind(marker)}
          @mouseleave=${onMarkerLeave}
          style=${`left: ${(marker.time / endTime) * 100}%;`}
        ></span>
      `,
    );
  }

  return html`
    <div class="plyr__controls__item plyr__progress__container">
      <div class="plyr__progress">
        <media-time-slider
          class="plyr__slider"
          data-plyr="seek"
          pause-while-dragging
          key-step=${$signal(seekTime)}
          aria-label=${$seekText}
          @media-seeking-request=${onSeekingRequest}
        >
          <div class="plyr__slider__track"></div>
          <div class="plyr__slider__thumb"></div>
          <div class="plyr__slider__buffer"></div>
          ${$signal(Preview)}${$signal(Markers)}
        </media-time-slider>
      </div>
    </div>
  `;
}

function Volume(type: 'mute' | 'volume' | 'mute+volume') {
  return $signal(() => {
    const hasMuteButton = type === 'mute' || type === 'mute+volume',
      hasVolumeSlider = type === 'volume' || type === 'mute+volume';
    return html`
      <div class="plyr__controls__item plyr__volume">
        ${[hasMuteButton ? MuteButton() : null, hasVolumeSlider ? VolumeSlider() : null]}
      </div>
    `;
  });
}

function VolumeSlider() {
  const { translations } = usePlyrLayoutContext(),
    $volumeText = $i18n(translations, 'Volume');
  return html`
    <media-volume-slider class="plyr__slider" data-plyr="volume" aria-label=${$volumeText}>
      <div class="plyr__slider__track"></div>
      <div class="plyr__slider__thumb"></div>
    </media-volume-slider>
  `;
}

function CurrentTime() {
  const media = useMediaContext(),
    { translations, invertTime, toggleTime, displayDuration } = usePlyrLayoutContext(),
    invert = signal(peek(invertTime));

  function onPress(event: Event) {
    if (!toggleTime() || displayDuration() || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
      return;
    }

    invert.set((n) => !n);
  }

  function MaybeDuration() {
    return $signal(() => (displayDuration() ? Duration() : null));
  }

  return $signal(() => {
    const { streamType } = media.$state,
      $liveText = $i18n(translations, 'LIVE'),
      $currentTimeText = $i18n(translations, 'Current time'),
      $remainder = $signal(() => !displayDuration() && invert());
    return streamType() === 'live' || streamType() === 'll-live'
      ? html`
          <media-live-button
            class="plyr__controls__item plyr__control plyr__live-button"
            data-plyr="live"
          >
            <span class="plyr__live-button__text">${$liveText}</span>
          </media-live-button>
        `
      : html`
          <media-time
            type="current"
            class="plyr__controls__item plyr__time plyr__time--current"
            tabindex="0"
            role="timer"
            aria-label=${$currentTimeText}
            ?remainder=${$remainder}
            @pointerup=${onPress}
            @keydown=${onPress}
          ></media-time>
          ${MaybeDuration()}
        `;
  });
}

function Duration() {
  const { translations } = usePlyrLayoutContext(),
    $durationText = $i18n(translations, 'Duration');
  return html`
    <media-time
      type="duration"
      class="plyr__controls__item plyr__time plyr__time--duration"
      role="timer"
      tabindex="0"
      aria-label=${$durationText}
    ></media-time>
  `;
}

function DownloadButton() {
  return $signal(() => {
    const media = useMediaContext(),
      { translations, download } = usePlyrLayoutContext(),
      { title, source } = media.$state,
      $src = source(),
      $download = download(),
      file = getDownloadFile({
        title: title(),
        src: $src,
        download: $download,
      }),
      $downloadText = $i18n(translations, 'Download');

    return file
      ? html`
          <a
            class="plyr__controls__item plyr__control"
            href=${file.url + `?download=${file.name}`}
            download=${file.name}
            target="_blank"
          >
            <slot name="download-icon" />
            <span class="plyr__tooltip">${$downloadText}</span>
          </a>
        `
      : null;
  });
}

function Gestures() {
  return $signal(() => {
    const { clickToPlay, clickToFullscreen } = usePlyrLayoutContext();
    return [
      clickToPlay()
        ? html`
            <media-gesture
              class="plyr__gesture"
              event="pointerup"
              action="toggle:paused"
            ></media-gesture>
          `
        : null,
      clickToFullscreen()
        ? html`
            <media-gesture
              class="plyr__gesture"
              event="dblpointerup"
              action="toggle:fullscreen"
            ></media-gesture>
          `
        : null,
    ];
  });
}

function Captions() {
  const media = useMediaContext(),
    activeCue = signal<VTTCue | undefined>(undefined),
    $cueText = $signal(() => unsafeHTML(activeCue()?.text));

  effect(() => {
    const track = media.$state.textTrack();
    if (!track) return;

    function onCueChange() {
      activeCue.set(track?.activeCues[0]);
    }

    onCueChange();
    return listenEvent(track, 'cue-change', onCueChange);
  });

  return html`
    <div class="plyr__captions" dir="auto">
      <span class="plyr__caption">${$cueText}</span>
    </div>
  `;
}

function Settings() {
  const { translations } = usePlyrLayoutContext(),
    $settingsText = $i18n(translations, 'Settings');
  return html`
    <div class="plyr__controls__item plyr__menu">
      <media-menu>
        <media-menu-button class="plyr__control" data-plyr="settings">
          <slot name="settings-icon" />
          <span class="plyr__tooltip">${$settingsText}</span>
        </media-menu-button>
        <media-menu-items class="plyr__menu__container" placement="top end">
          <div><div>${[AudioMenu(), CaptionsMenu(), QualityMenu(), SpeedMenu()]}</div></div>
        </media-menu-items>
      </media-menu>
    </div>
  `;
}

function Menu({ label, children }: { label: PlyrLayoutWord; children: TemplateResult }) {
  const open = signal(false),
    onOpen = () => open.set(true),
    onClose = () => open.set(false);
  return html`
    <media-menu @open=${onOpen} @close=${onClose}>
      ${MenuButton({ label, open })}
      <media-menu-items>${children}</media-menu-items>
    </media-menu>
  `;
}

function MenuButton({ open, label }: { label: PlyrLayoutWord; open: ReadSignal<boolean> }) {
  const { translations } = usePlyrLayoutContext(),
    $class = $signal(() => `plyr__control plyr__control--${open() ? 'back' : 'forward'}`);

  function GoBackText() {
    const $text = $i18n(translations, 'Go back to previous menu');
    return $signal(() => (open() ? html`<span class="plyr__sr-only">${$text}</span>` : null));
  }

  return html`
    <media-menu-button class=${$class} data-plyr="settings">
      <span class="plyr__menu__label" aria-hidden=${$aria(open)}>
        ${$i18n(translations, label)}
      </span>
      <span class="plyr__menu__value" data-part="hint"></span>
      ${GoBackText()}
    </media-menu-button>
  `;
}

function AudioMenu() {
  return Menu({ label: 'Audio', children: AudioRadioGroup() });
}

function AudioRadioGroup() {
  const { translations } = usePlyrLayoutContext();
  return html`
    <media-audio-radio-group empty-label=${$i18n(translations, 'Default')}>
      <template>
        <media-radio class="plyr__control" data-plyr="audio">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-audio-radio-group>
  `;
}

function SpeedMenu() {
  return Menu({ label: 'Speed', children: SpeedRadioGroup() });
}

function SpeedRadioGroup() {
  const { translations, speed } = usePlyrLayoutContext();
  return html`
    <media-speed-radio-group .rates=${speed} normal-label=${$i18n(translations, 'Normal')}>
      <template>
        <media-radio class="plyr__control" data-plyr="speed">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-speed-radio-group>
  `;
}

function CaptionsMenu() {
  return Menu({ label: 'Captions', children: CaptionsRadioGroup() });
}

function CaptionsRadioGroup() {
  const { translations } = usePlyrLayoutContext();
  return html`
    <media-captions-radio-group off-label=${$i18n(translations, 'Disabled')}>
      <template>
        <media-radio class="plyr__control" data-plyr="captions">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-captions-radio-group>
  `;
}

function QualityMenu() {
  return Menu({ label: 'Quality', children: QualityRadioGroup() });
}

function QualityRadioGroup() {
  const { translations } = usePlyrLayoutContext();
  return html`
    <media-quality-radio-group auto-label=${$i18n(translations, 'Auto')}>
      <template>
        <media-radio class="plyr__control" data-plyr="quality">
          <span data-part="label"></span>
        </media-radio>
      </template>
    </media-quality-radio-group>
  `;
}

function $aria(signal: ReadSignal<any>) {
  return $signal(() => (signal() ? 'true' : 'false'));
}

function $i18n(translations: PlyrLayoutContext['translations'], word: PlyrLayoutWord) {
  return $signal(() => i18n(translations, word));
}
