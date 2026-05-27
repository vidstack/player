import { html } from 'lit-html';
import { isArray } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultMenuButton, DefaultMenuSection } from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

export function DefaultSpeedMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext(),
      { canSetPlaybackRate, playbackRate } = useMediaState();

    if (!canSetPlaybackRate()) return null;

    return html`
      <media-menu class="vds-speed-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Speed'),
          icon: 'menu-speed-up',
        })}
        <media-menu-items class="vds-menu-items">
          ${DefaultMenuSection({
            label: $i18n(translations, 'Speed'),
            value: $signal(() =>
              playbackRate() === 1 ? i18n(translations, 'Normal') : playbackRate() + 'x',
            ),
            children: DefaultMenuSliderItem({
              upIcon: 'menu-font-size-up',
              downIcon: 'menu-font-size-down',
              children: DefaultSpeedSlider(),
              isMin: () => playbackRate() === getSpeedMin(),
              isMax: () => playbackRate() === getSpeedMax(),
            }),
          })}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function getSpeedMin() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates();
  return isArray(rates) ? (rates[0] ?? 0) : rates.min;
}

function getSpeedMax() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates();
  return isArray(rates) ? (rates[rates.length - 1] ?? 2) : rates.max;
}

function getSpeedStep() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates();
  return isArray(rates) ? rates[1] - rates[0] || 0.25 : rates.step;
}

function DefaultSpeedSlider() {
  const { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Speed'),
    $min = getSpeedMin,
    $max = getSpeedMax,
    $step = getSpeedStep;

  return html`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${$label}
      min=${$signal($min)}
      max=${$signal($max)}
      step=${$signal($step)}
      key-step=${$signal($step)}
    >
      ${DefaultSliderParts()}${DefaultSliderSteps()}
    </media-speed-slider>
  `;
}
