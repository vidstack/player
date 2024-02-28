import { html } from 'lit-html';
import { computed } from 'maverick.js';
import { isArray } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton, DefaultMenuSection } from './items/menu-items';
import {
  DefaultMenuSliderItem,
  DefaultSliderMarkers,
  DefaultSliderParts,
} from './items/menu-slider';

export function DefaultPlaybackMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext();
    return html`
      <media-menu class="vds-playback-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Playback'),
          icon: 'menu-playback',
        })}
        <media-menu-items class="vds-menu-items">
          ${[
            DefaultMenuSection({ children: DefaultMenuLoopCheckbox() }),
            DefaultMenuSpeedSection(),
            DefaultMenuQualitySection(),
          ]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultMenuLoopCheckbox() {
  const { remote } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    label = 'Loop',
    $label = $i18n(translations, label);
  return html`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${$label}</div>
      ${DefaultMenuCheckbox({
        label,
        storageKey: 'vds-player::user-loop',
        onChange(checked, trigger) {
          remote.userPrefersLoopChange(checked, trigger);
        },
      })}
    </div>
  `;
}

function DefaultMenuSpeedSection() {
  return $signal(() => {
    const { translations, playbackRates } = useDefaultLayoutContext(),
      { canSetPlaybackRate, playbackRate } = useMediaState();

    if (!canSetPlaybackRate()) return null;

    const $label = $i18n(translations, 'Speed'),
      $value = $signal(() =>
        playbackRate() === 1 ? i18n(translations, 'Normal') : playbackRate() + 'x',
      );

    return DefaultMenuSection({
      label: $label,
      value: $value,
      children: [
        DefaultMenuSliderItem({
          upIcon: 'menu-speed-up',
          downIcon: 'menu-speed-down',
          slider: DefaultSpeedSlider(),
          isMin: () => playbackRate() === getSpeedMin(),
          isMax: () => playbackRate() === getSpeedMax(),
        }),
      ],
    });
  });
}

function getSpeedMin() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates();
  return isArray(rates) ? rates[0] ?? 0 : rates.min;
}

function getSpeedMax() {
  const { playbackRates } = useDefaultLayoutContext(),
    rates = playbackRates();
  return isArray(rates) ? rates[rates.length - 1] ?? 2 : rates.max;
}

function DefaultSpeedSlider() {
  const { playbackRates, translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Speed'),
    $step = () => {
      const rates = playbackRates();
      return isArray(rates) ? rates[1] - rates[0] || 0.25 : rates.step;
    },
    $steps = computed(() => (getSpeedMax() - getSpeedMin()) / $step());

  return html`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${$label}
      min=${$signal(getSpeedMin)}
      max=${$signal(getSpeedMax)}
      step=${$signal($step)}
    >
      ${DefaultSliderParts()}${DefaultSliderMarkers($steps)}
    </media-speed-slider>
  `;
}
function DefaultMenuAutoQualityCheckbox() {
  const { remote, qualities } = useMediaContext(),
    { autoQuality, canSetQuality, qualities: $qualities } = useMediaState(),
    { translations } = useDefaultLayoutContext(),
    label = 'Auto',
    $label = $i18n(translations, label),
    $disabled = computed(() => !canSetQuality() || $qualities().length === 0);

  if ($disabled()) return null;

  return html`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${$label}</div>
      ${DefaultMenuCheckbox({
        label,
        checked: autoQuality,
        onChange(checked, trigger) {
          if (checked) {
            remote.requestAutoQuality(trigger);
          } else {
            remote.changeQuality(qualities.selectedIndex, trigger);
          }
        },
      })}
    </div>
  `;
}

function DefaultMenuQualitySection() {
  return $signal(() => {
    const { hideQualityBitrate, translations } = useDefaultLayoutContext(),
      { canSetQuality, qualities, quality } = useMediaState(),
      $disabled = computed(() => !canSetQuality() || qualities().length === 0);

    if ($disabled()) return null;

    const $label = $i18n(translations, 'Quality'),
      $value = $signal(() => {
        const height = quality()?.height,
          bitrate = !hideQualityBitrate() ? quality()?.bitrate : null,
          bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1000000).toFixed(2)} Mbps` : null,
          autoText = i18n(translations, 'Auto');
        return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ''}` : autoText;
      }),
      isMin = () => qualities()[0] === quality(),
      isMax = () => qualities().at(-1) === quality();

    return DefaultMenuSection({
      label: $label,
      value: $value,
      children: [
        DefaultMenuSliderItem({
          upIcon: 'menu-quality-up',
          downIcon: 'menu-quality-down',
          slider: DefaultQualitySlider(),
          isMin,
          isMax,
        }),
        DefaultMenuAutoQualityCheckbox(),
      ],
    });
  });
}

function DefaultQualitySlider() {
  const { translations } = useDefaultLayoutContext(),
    { qualities } = useMediaState(),
    $label = $i18n(translations, 'Quality'),
    $steps = computed(() => qualities().length - 1);
  return html`
    <media-quality-slider class="vds-quality-slider vds-slider" aria-label=${$label}>
      ${DefaultSliderParts()}${DefaultSliderMarkers($steps)}
    </media-quality-slider>
  `;
}
