import { html } from 'lit-html';
import { keyed } from 'lit-html/directives/keyed.js';
import { computed, effect, signal } from 'maverick.js';
import { camelToKebabCase } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import { useMediaContext } from '../../../../../core/api/media-context';
import { createSlot } from '../../../../../utils/dom';
import { $signal } from '../../../../lit/directives/signal';

export function DefaultKeyboardDisplay() {
  return $signal(() => {
    const media = useMediaContext(),
      { noKeyboardAnimations, userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
      $disabled = computed(() => noKeyboardAnimations() || !userPrefersKeyboardAnimations());

    if ($disabled()) {
      return null;
    }

    const visible = signal(false),
      { lastKeyboardAction } = media.$state;

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
      const $slot = $iconSlot();
      if (!$slot) return null;
      return html`
        <div class="vds-kb-bezel">
          <div class="vds-kb-icon">${$slot}</div>
        </div>
      `;
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
