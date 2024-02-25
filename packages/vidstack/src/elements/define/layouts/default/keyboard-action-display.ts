import { html } from 'lit-html';
import { keyed } from 'lit-html/directives/keyed.js';
import { computed, effect, signal } from 'maverick.js';
import { camelToKebabCase } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { i18n } from '../../../../components/layouts/default/translations';
import { useMediaContext } from '../../../../core/api/media-context';
import { createSlot } from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';

export function DefaultKeyboardDisplay() {
  return $signal(() => {
    const visible = signal(false),
      media = useMediaContext(),
      { noKeyboardAnimations, userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
      { lastKeyboardAction } = media.$state,
      $isAnimated = computed(() => !noKeyboardAnimations() && userPrefersKeyboardAnimations());

    if (!$isAnimated()) {
      return DefaultKeyboardStatus({ className: 'vds-sr-only' });
    }

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
      $iconSlot = computed(() => {
        const name = getIconName();
        return name ? createSlot(name) : null;
      });

    function Icon() {
      return DefaultKeyboardStatus({
        className: 'vds-kb-bezel',
        children: $signal(() => {
          const $slot = $iconSlot();
          if (!$slot) return null;
          return html`<div class="vds-kb-icon">${$slot}</div>`;
        }),
      });
    }

    return html`
      <div class=${$signal($classList)} data-action=${$signal($actionDataAttr)}>
        <div class="vds-kb-text-wrapper">
          <div class="vds-kb-text">${$signal($text)}</div>
        </div>
        ${$signal(() => keyed(lastKeyboardAction(), Icon()))}
      </div>
    `;
  });
}

export function DefaultKeyboardStatus({
  className = null,
  children = null,
}: {
  className?: string | null;
  children?: any;
} = {}) {
  const $statusLabel = computed(getStatusLabel),
    $busy = signal(false);

  effect(() => {
    $statusLabel();
    $busy.set(true);

    const id = window.setTimeout(() => {
      $busy.set(false);
    }, 150);

    return () => window.clearTimeout(id);
  });

  return html`
    <div
      class=${className}
      role="status"
      aria-live="assertive"
      aria-busy=${$signal(() => ($busy() ? 'true' : null))}
      aria-label=${$signal($statusLabel)}
    >
      ${children}
    </div>
  `;
}

function getText() {
  const { $state } = useMediaContext(),
    action = $state.lastKeyboardAction()?.action,
    audioGain = $state.audioGain() ?? 1;
  switch (action) {
    case 'toggleMuted':
      return $state.muted() ? '0%' : getVolumeText($state.volume(), audioGain);
    case 'volumeUp':
    case 'volumeDown':
      return getVolumeText($state.volume(), audioGain);
    default:
      return '';
  }
}

function getVolumeText(volume: number, gain: number) {
  return `${Math.round(volume * gain * 100)}%`;
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
    case 'seekForward':
      return 'kb-seek-forward-icon';
    case 'seekBackward':
      return 'kb-seek-backward-icon';
    default:
      return null;
  }
}

function getStatusLabel() {
  const $text = getStatusText(),
    { translations } = useDefaultLayoutContext();
  return $text ? i18n(translations, $text) : null;
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
        : `${Math.round($state.volume() * ($state.audioGain() ?? 1) * 100)}% ${translations()?.Volume ?? 'Volume'}`;
    case 'seekForward':
      return 'Seek Forward';
    case 'seekBackward':
      return 'Seek Backward';
    default:
      return null;
  }
}
