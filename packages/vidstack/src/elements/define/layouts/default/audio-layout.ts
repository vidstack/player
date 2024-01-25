import { html } from 'lit-html';
import { ref } from 'lit-html/directives/ref.js';
import { effect, signal } from 'maverick.js';
import { toggleClass } from 'maverick.js/std';

import { watchCueTextChange } from '../../../..';
import { useDefaultLayoutContext } from '../../../../components/layouts/default/context';
import { i18n } from '../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../core/api/media-context';
import {
  useActive,
  useMouseEnter,
  useRectCSSVars,
  useResizeObserver,
  useTransitionActive,
} from '../../../../utils/dom';
import { $signal } from '../../../lit/directives/signal';
import {
  DefaultCaptionButton,
  DefaultChaptersMenu,
  DefaultChapterTitle,
  DefaultControlsSpacer,
  DefaultMuteButton,
  DefaultPlayButton,
  DefaultSeekButton,
  DefaultSettingsMenu,
  DefaultTimeInvert,
  DefaultTimeSlider,
  DefaultVolumeSlider,
} from './shared-layout';

export function DefaultAudioLayout() {
  return [
    html`<media-captions class="vds-captions"></media-captions>`,
    html`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[
            DefaultSeekButton({ seconds: -10, tooltip: 'top start' }),
            DefaultPlayButton({ tooltip: 'top' }),
            DefaultSeekButton({ seconds: 10, tooltip: 'top' }),
            DefaultAudioTitle(),
            DefaultTimeSlider(),
            DefaultTimeInvert(),
            DefaultAudioVolume(),
            DefaultCaptionButton({ tooltip: 'top' }),
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

function DefaultAudioVolume() {
  return $signal(() => {
    const { pointer, muted } = useMediaState();

    if (pointer() === 'coarse' && !muted()) return null;

    const $rootRef = signal<Element | undefined>(undefined),
      $triggerRef = signal<Element | undefined>(undefined),
      $popperRef = signal<Element | undefined>(undefined),
      $isRootActive = useActive($rootRef),
      $hasMouseEnteredTrigger = useMouseEnter($triggerRef);

    effect(() => {
      if (!$hasMouseEnteredTrigger()) return;
      useRectCSSVars($rootRef, $triggerRef, 'trigger');
      useRectCSSVars($rootRef, $popperRef, 'popper');
    });

    return html`
      <div class="vds-volume" ?data-active=${$signal($isRootActive)} ${ref($rootRef.set)}>
        ${DefaultMuteButton({ tooltip: 'top', ref: $triggerRef.set })}
        <div class="vds-volume-popup" ${ref($popperRef.set)}>
          ${DefaultVolumeSlider({ orientation: 'vertical' })}
        </div>
      </div>
    `;
  });
}

function DefaultAudioMenus() {
  const placement = 'top end';
  return [
    DefaultChaptersMenu({ tooltip: 'top', placement, portal: true }),
    DefaultSettingsMenu({ tooltip: 'top end', placement, portal: true }),
  ];
}
