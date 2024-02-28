import { html } from 'lit-html';
import { computed } from 'maverick.js';
import { isArray } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { renderMenuButton } from './items/menu-items';
import { DefaultMenuSlider, DefaultSliderParts } from './items/menu-slider';

export function DefaultPlaybackMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext();
    return html`
      <media-menu class="vds-playback-menu vds-menu">
        ${renderMenuButton({
          label: () => i18n(translations, 'Playback'),
          icon: 'menu-playback',
        })}
        <media-menu-items class="vds-menu-items">
          ${[
            DefaultMenuLoopCheckbox(),
            DefaultMenuAutoQualityCheckbox(),
            DefaultMenuSpeedSlider(),
            DefaultMenuQualitySlider(),
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
    <div class="vds-menu-item vds-menu-item-checkbox">
      <div class="vds-menu-checkbox-label">${$label}</div>
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

function DefaultMenuSpeedSlider() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext(),
      { canSetPlaybackRate, playbackRate } = useMediaState();

    if (!canSetPlaybackRate()) return null;

    const $label = $i18n(translations, 'Speed'),
      $value = $signal(() =>
        playbackRate() === 1 ? i18n(translations, 'Normal') : playbackRate() + 'x',
      );

    return DefaultMenuSlider({
      label: $label,
      value: $value,
      children: [
        html`<slot name="menu-speed-down-icon"></slot>`,
        DefaultSpeedSlider(),
        html`<slot name="menu-speed-up-icon"></slot>`,
      ],
    });
  });
}

function DefaultSpeedSlider() {
  const { playbackRates, translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Speed'),
    $min = () => {
      const rates = playbackRates();
      return isArray(rates) ? rates[0] ?? 0 : rates.min;
    },
    $max = () => {
      const rates = playbackRates();
      return isArray(rates) ? rates[rates.length - 1] ?? 2 : rates.max;
    },
    $step = () => {
      const rates = playbackRates();
      return isArray(rates) ? rates[1] - rates[0] || 0.25 : rates.step;
    };

  return html`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${$label}
      min=${$signal($min)}
      max=${$signal($max)}
      step=${$signal($step)}
    >
      ${DefaultSliderParts()}
    </media-speed-slider>
  `;
}
function DefaultMenuAutoQualityCheckbox() {
  const { remote, qualities } = useMediaContext(),
    { autoQuality, canSetQuality, qualities: $qualities } = useMediaState(),
    { translations } = useDefaultLayoutContext(),
    label = 'Auto Select',
    $label = $i18n(translations, label),
    $disabled = computed(() => !canSetQuality() || $qualities().length === 0);

  if ($disabled()) return null;

  return html`
    <div class="vds-menu-item vds-menu-item-checkbox">
      <div class="vds-menu-checkbox-label">${$label}</div>
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

function DefaultMenuQualitySlider() {
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
      });

    return DefaultMenuSlider({
      label: $label,
      value: $value,
      children: [
        html`<slot name="menu-quality-down-icon"></slot>`,
        DefaultQualitySlider(),
        html`<slot name="menu-quality-up-icon"></slot>`,
      ],
    });
  });
}

function DefaultQualitySlider() {
  const { translations } = useDefaultLayoutContext(),
    $label = $i18n(translations, 'Quality');
  return html`
    <media-quality-slider class="vds-quality-slider vds-slider" aria-label=${$label}>
      ${DefaultSliderParts()}
    </media-quality-slider>
  `;
}
