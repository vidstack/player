import { html } from 'lit-html';
import { computed, effect, signal } from 'maverick.js';
import { camelToKebabCase } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { getDefaultLayoutLang } from '../../../../components/layouts/default/translations';
import { useMediaContext } from '../../../../core/api/media-context';
import { createSlot } from '../../../../utils/dom';
import { $computed, $signal } from '../../../lit/directives/signal';

export function DefaultVideoKeyboardActionDisplay() {
  const visible = signal(false),
    media = useMediaContext(),
    { noKeyboardActionDisplay } = useDefaultLayoutContext(),
    { lastKeyboardAction } = media.$state;

  if (noKeyboardActionDisplay()) return null;

  effect(() => {
    visible.set(!!lastKeyboardAction());
    const id = setTimeout(() => visible.set(false), 500);
    return () => {
      visible.set(false);
      window.clearTimeout(id);
    };
  });

  const $actionDataAttr = computed(() => {
    const action = lastKeyboardAction()?.action;
    return action && visible() ? camelToKebabCase(action) : null;
  });

  const $classList = computed(() => `vds-kb-action${!visible() ? ' hidden' : ''}`),
    $text = computed(getText),
    $statusLabel = computed(getStatusLabel),
    $iconSlot = computed(() => {
      const name = getIconName();
      return name ? createSlot(name) : null;
    });

  function Icon() {
    const $slot = $iconSlot();
    return $slot
      ? html`
          <div class="vds-kb-bezel" role="status" aria-label=${$signal($statusLabel)}>
            <div class="vds-kb-icon">${$iconSlot()}</div>
          </div>
        `
      : null;
  }

  return html`
    <div class=${$signal($classList)} data-action=${$signal($actionDataAttr)}>
      <div class="vds-kb-text-wrapper">
        <div class="vds-kb-text">${$signal($text)}</div>
      </div>
      ${$computed(Icon)}
    </div>
  `;
}

function getText() {
  const { $state } = useMediaContext(),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'toggleMuted':
      return $state.muted() ? '0%' : getVolumeText($state.volume());
    case 'volumeUp':
    case 'volumeDown':
      return getVolumeText($state.volume());
    default:
      return '';
  }
}

function getVolumeText(volume: number) {
  return `${Math.round(volume * 100)}%`;
}

function getIconName() {
  const { $state } = useMediaContext(),
    action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case 'togglePaused':
      return !$state.paused() ? 'kb-play-icon' : 'kb-pause-icon';
    case 'toggleMuted':
      return $state.muted() || $state.volume() === 0
        ? 'kb-mute-icon'
        : $state.volume() >= 0.5
          ? 'kb-volume-up-icon'
          : 'kb-volume-down-icon';
    case 'toggleFullscreen':
      return `kb-fs-${$state.fullscreen() ? 'enter' : 'exit'}-icon`;
    case 'togglePictureInPicture':
      return `kb-pip-${$state.pictureInPicture() ? 'enter' : 'exit'}-icon`;
    case 'toggleCaptions':
      return $state.hasCaptions() ? `kb-cc-${$state.textTrack() ? 'on' : 'off'}-icon` : null;
    case 'volumeUp':
      return 'kb-volume-up-icon';
    case 'volumeDown':
      return 'kb-volume-down-icon';
    default:
      return null;
  }
}

function getStatusLabel() {
  const $text = getStatusText(),
    { translations } = useDefaultLayoutContext();
  return $text ? getDefaultLayoutLang(translations, $text) : null;
}

function getStatusText(): any {
  const { $state } = useMediaContext(),
    action = $state.lastKeyboardAction()?.action,
    { translations } = useDefaultLayoutContext();
  switch (action) {
    case 'togglePaused':
      return !$state.paused() ? 'Play' : 'Pause';
    case 'toggleFullscreen':
      return $state.fullscreen() ? 'Enter Fullscreen' : 'Exit Fullscreen';
    case 'togglePictureInPicture':
      return $state.pictureInPicture() ? 'Enter PiP' : 'Exit PiP';
    case 'toggleCaptions':
      return $state.textTrack() ? 'Closed-Captions On' : 'Closed-Captions Off';
    case 'toggleMuted':
    case 'volumeUp':
    case 'volumeDown':
      return $state.muted() || $state.volume() === 0
        ? 'Mute'
        : `${Math.round($state.volume() * 100)}% ${translations()?.Volume ?? 'Volume'}`;
    default:
      return null;
  }
}
