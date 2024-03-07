import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ref } from 'lit-html/directives/ref.js';
import { signal } from 'maverick.js';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import type { SliderOrientation } from '../../../../../components/ui/sliders/slider/types';
import type { TooltipPlacement } from '../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../core/api/media-context';
import { useActive, useResizeObserver } from '../../../../../utils/dom';
import { $signal } from '../../../../lit/directives/signal';
import { DefaultMuteButton } from './buttons';
import { $i18n } from './utils';

export function DefaultVolumePopup({
  orientation,
  tooltip,
}: {
  orientation: SliderOrientation;
  tooltip: TooltipPlacement;
}) {
  return $signal(() => {
    const { pointer, muted, canSetVolume } = useMediaState();

    if (pointer() === 'coarse' && !muted()) return null;

    if (!canSetVolume()) {
      return DefaultMuteButton({ tooltip });
    }

    const $rootRef = signal<Element | undefined>(undefined),
      $isRootActive = useActive($rootRef);

    return html`
      <div class="vds-volume" ?data-active=${$signal($isRootActive)} ${ref($rootRef.set)}>
        ${DefaultMuteButton({ tooltip })}
        <div class="vds-volume-popup">${DefaultVolumeSlider({ orientation })}</div>
      </div>
    `;
  });
}

export function DefaultVolumeSlider({ orientation }: { orientation?: SliderOrientation } = {}) {
  const { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Volume');
  return html`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${$label}
      orientation=${ifDefined(orientation)}
    >
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
  const $ref = signal<Element | undefined>(undefined),
    $width = signal(0),
    {
      thumbnails,
      translations,
      sliderChaptersMinWidth,
      disableTimeSlider,
      seekStep,
      noScrubGesture,
    } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Seek'),
    $isDisabled = $signal(disableTimeSlider),
    $isChaptersDisabled = $signal(() => $width() < sliderChaptersMinWidth()),
    $thumbnails = $signal(thumbnails);

  useResizeObserver($ref, () => {
    const el = $ref();
    el && $width.set(el.clientWidth);
  });

  return html`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${$label}
      key-step=${$signal(seekStep)}
      ?disabled=${$isDisabled}
      ?no-swipe-gesture=${$signal(noScrubGesture)}
      ${ref($ref.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$isChaptersDisabled}>
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
          .src=${$thumbnails}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
}
