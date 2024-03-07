import { html } from 'lit-html';
import { ref } from 'lit-html/directives/ref.js';
import { effect, signal } from 'maverick.js';
import { toggleClass } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { i18n } from '../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../core/api/media-context';
import { useResizeObserver, useTransitionActive } from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';
import { DefaultAnnouncer } from './ui/announcer';
import {
  DefaultCaptionButton,
  DefaultDownloadButton,
  DefaultPlayButton,
  DefaultSeekButton,
} from './ui/buttons';
import { DefaultCaptions } from './ui/captions';
import { DefaultControlsSpacer } from './ui/controls';
import { DefaultChaptersMenu } from './ui/menu/chapters-menu';
import { DefaultSettingsMenu } from './ui/menu/settings-menu';
import { DefaultTimeSlider, DefaultVolumePopup } from './ui/slider';
import { DefaultTimeInvert } from './ui/time';
import { DefaultChapterTitle } from './ui/title';

export function DefaultAudioLayout() {
  return [
    DefaultAnnouncer(),
    DefaultCaptions(),
    html`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
            DefaultSeekButton({ backward: true, tooltip: 'top start' }),
            DefaultPlayButton({ tooltip: 'top' }),
            DefaultSeekButton({ tooltip: 'top' }),
            DefaultAudioTitle(),
            DefaultTimeSlider(),
            DefaultTimeInvert(),
            DefaultVolumePopup({ orientation: 'vertical', tooltip: 'top' }),
            DefaultCaptionButton({ tooltip: 'top' }),
            DefaultDownloadButton(),
            DefaultAudioMenus(),
          ]}
        </media-controls-group>
      </media-controls>
    `,
  ];
}

function DefaultAudioTitle() {
  return $signal(() => {
    let $ref = signal<Element | undefined>(undefined),
      $isTextOverflowing = signal(false),
      media = useMediaContext(),
      { title, started, currentTime, ended } = useMediaState(),
      { translations } = useDefaultLayoutContext(),
      $isTransitionActive = useTransitionActive($ref),
      $isContinued = () => started() || currentTime() > 0;

    const $title = () => {
      const word = ended() ? 'Replay' : $isContinued() ? 'Continue' : 'Play';
      return `${i18n(translations, word)}: ${title()}`;
    };

    effect(() => {
      if ($isTransitionActive() && document.activeElement === document.body) {
        media.player.el?.focus();
      }
    });

    function onResize() {
      const el = $ref(),
        isOverflowing =
          !!el && !$isTransitionActive() && el.clientWidth < el.children[0]!.clientWidth;

      el && toggleClass(el, 'vds-marquee', isOverflowing);

      $isTextOverflowing.set(isOverflowing);
    }

    function Title() {
      return html`
        <span class="vds-title-text">
          ${$signal($title)}${$signal(() => ($isContinued() ? DefaultChapterTitle() : null))}
        </span>
      `;
    }

    useResizeObserver($ref, onResize);

    return title()
      ? html`
          <span class="vds-title" title=${$signal($title)} ${ref($ref.set)}>
            ${[
              Title(),
              $signal(() => ($isTextOverflowing() && !$isTransitionActive() ? Title() : null)),
            ]}
          </span>
        `
      : DefaultControlsSpacer();
  });
}

function DefaultAudioMenus() {
  const placement = 'top end';
  return [
    DefaultChaptersMenu({ tooltip: 'top', placement, portal: true }),
    DefaultSettingsMenu({ tooltip: 'top end', placement, portal: true }),
  ];
}
