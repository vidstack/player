import { html } from 'lit-html';
import { ref as $ref, type RefOrCallback } from 'lit-html/directives/ref.js';
import { isNil, noop, uppercaseFirstChar } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import { i18n } from '../../../../../components/layouts/default/translations';
import type { TooltipPlacement } from '../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../core/api/media-context';
import { getDownloadFile } from '../../../../../utils/network';
import { $signal } from '../../../../lit/directives/signal';
import { IconSlot, IconSlots } from '../slots';
import { $i18n } from './utils';

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
          ${IconSlot('airplay')}
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
          ${IconSlot('google-cast')}
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
          ${IconSlots(['play', 'pause', 'replay'])}
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
          ${IconSlots(['mute', 'volume-low', 'volume-high'])}
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
          ${IconSlots(['cc-on', 'cc-off'])}
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
          ${IconSlots(['pip-enter', 'pip-exit'])}
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
          ${IconSlots(['fs-enter', 'fs-exit'])}
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
          ${!backward ? IconSlot('seek-forward') : IconSlot('seek-backward')}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seekText)}
      </media-tooltip-content>
    </media-tooltip>
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

export function DefaultDownloadButton() {
  return $signal(() => {
    const { download, translations } = useDefaultLayoutContext(),
      $download = download();

    if (isNil($download)) return null;

    const { source, title } = useMediaState(),
      $src = source(),
      file = getDownloadFile({
        title: title(),
        src: $src,
        download: $download,
      });

    return file
      ? html`
          <media-tooltip class="vds-download-tooltip vds-tooltip">
            <media-tooltip-trigger>
              <a
                role="button"
                class="vds-download-button vds-button"
                aria-label=${$i18n(translations, 'Download')}
                href=${file.url + `?download=${file.name}`}
                download=${file.name}
                target="_blank"
              >
                <slot name="download-icon" data-class="vds-icon" />
              </a>
            </media-tooltip-trigger>
            <media-tooltip-content class="vds-tooltip-content" placement="top">
              ${$i18n(translations, 'Download')}
            </media-tooltip-content>
          </media-tooltip>
        `
      : null;
  });
}
