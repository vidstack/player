import { html } from 'lit-html';
import { tick } from 'maverick.js';
import { camelToKebabCase, isString } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../../../core/api/media-context';
import {
  FONT_COLOR_OPTION,
  FONT_FAMILY_OPTION,
  FONT_OPACITY_OPTION,
  FONT_SIGNALS,
  FONT_SIZE_OPTION,
  FONT_TEXT_SHADOW_OPTION,
  onFontReset,
  type DefaultFontSettingProps,
} from '../../../../../../core/font/font-options';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import {
  createRadioOptions,
  DefaultMenuButton,
  DefaultMenuItem,
  DefaultMenuSection,
  DefaultRadioGroup,
} from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

const FONT_SIZE_OPTION_WITH_ICONS = {
  ...FONT_SIZE_OPTION,
  upIcon: 'menu-opacity-up',
  downIcon: 'menu-opacity-down',
};

const FONT_OPACITY_OPTION_WITH_ICONS = {
  ...FONT_OPACITY_OPTION,
  upIcon: 'menu-opacity-up',
  downIcon: 'menu-opacity-down',
};

export function DefaultFontMenu() {
  return $signal(() => {
    const { hasCaptions } = useMediaState(),
      { translations } = useDefaultLayoutContext();

    if (!hasCaptions()) return null;

    return html`
      <media-menu class="vds-font-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Caption Styles'),
        })}
        <media-menu-items class="vds-menu-items">
          ${[
            DefaultMenuSection({
              label: $i18n(translations, 'Font'),
              children: [DefaultFontFamilyMenu(), DefaultFontSizeSlider()],
            }),
            DefaultMenuSection({
              label: $i18n(translations, 'Text'),
              children: [
                DefaultTextColorInput(),
                DefaultTextShadowMenu(),
                DefaultTextOpacitySlider(),
              ],
            }),
            DefaultMenuSection({
              label: $i18n(translations, 'Text Background'),
              children: [DefaultTextBgInput(), DefaultTextBgOpacitySlider()],
            }),
            DefaultMenuSection({
              label: $i18n(translations, 'Display Background'),
              children: [DefaultDisplayBgInput(), DefaultDisplayOpacitySlider()],
            }),
            DefaultMenuSection({
              children: [DefaultResetMenuItem()],
            }),
          ]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultFontFamilyMenu() {
  return DefaultFontSetting({
    label: 'Family',
    option: FONT_FAMILY_OPTION,
    type: 'fontFamily',
  });
}

function DefaultFontSizeSlider() {
  return DefaultFontSetting({
    label: 'Size',
    option: FONT_SIZE_OPTION_WITH_ICONS,
    type: 'fontSize',
  });
}

function DefaultTextColorInput() {
  return DefaultFontSetting({
    label: 'Color',
    option: FONT_COLOR_OPTION,
    type: 'textColor',
  });
}

function DefaultTextOpacitySlider() {
  return DefaultFontSetting({
    label: 'Opacity',
    option: FONT_OPACITY_OPTION_WITH_ICONS,
    type: 'textOpacity',
  });
}

function DefaultTextShadowMenu() {
  return DefaultFontSetting({
    label: 'Shadow',
    option: FONT_TEXT_SHADOW_OPTION,
    type: 'textShadow',
  });
}

function DefaultTextBgInput() {
  return DefaultFontSetting({
    label: 'Color',
    option: FONT_COLOR_OPTION,
    type: 'textBg',
  });
}

function DefaultTextBgOpacitySlider() {
  return DefaultFontSetting({
    label: 'Opacity',
    option: FONT_OPACITY_OPTION_WITH_ICONS,
    type: 'textBgOpacity',
  });
}

function DefaultDisplayBgInput() {
  return DefaultFontSetting({
    label: 'Color',
    option: FONT_COLOR_OPTION,
    type: 'displayBg',
  });
}

function DefaultDisplayOpacitySlider() {
  return DefaultFontSetting({
    label: 'Opacity',
    option: FONT_OPACITY_OPTION_WITH_ICONS,
    type: 'displayBgOpacity',
  });
}

function DefaultResetMenuItem() {
  const { translations } = useDefaultLayoutContext(),
    $label = () => i18n(translations, 'Reset');

  return html`
    <button class="vds-menu-item" role="menuitem" @click=${onFontReset}>
      <span class="vds-menu-item-label">${$signal($label)}</span>
    </button>
  `;
}

function DefaultFontSetting({ label, option, type }: DefaultFontSettingProps) {
  const { player } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    $currentValue = FONT_SIGNALS[type],
    $label = () => i18n(translations, label);

  function notify() {
    tick();
    player.dispatchEvent(new Event('vds-font-change'));
  }

  if (option.type === 'color') {
    function onColorChange(event) {
      $currentValue.set(event.target.value);
      notify();
    }

    return DefaultMenuItem({
      label: $signal($label),
      children: html`
        <input
          class="vds-color-picker"
          type="color"
          .value=${$signal($currentValue)}
          @input=${onColorChange}
        />
      `,
    });
  }

  if (option.type === 'slider') {
    const { min, max, step, upIcon, downIcon } = option;

    function onSliderValueChange(event) {
      $currentValue.set(event.detail + '%');
      notify();
    }

    return DefaultMenuSliderItem({
      label: $signal($label),
      value: $signal($currentValue),
      upIcon,
      downIcon,
      isMin: () => $currentValue() === min + '%',
      isMax: () => $currentValue() === max + '%',
      children: html`
        <media-slider
          class="vds-slider"
          min=${min}
          max=${max}
          step=${step}
          key-step=${step}
          .value=${$signal(() => parseInt($currentValue()))}
          aria-label=${$signal($label)}
          @value-change=${onSliderValueChange}
          @drag-value-change=${onSliderValueChange}
        >
          ${DefaultSliderParts()}${DefaultSliderSteps()}
        </media-slider>
      `,
    });
  }

  const radioOptions = createRadioOptions(option.values),
    $hint = () => {
      const value = $currentValue(),
        label = radioOptions.find((radio) => radio.value === value)?.label || '';
      return i18n(translations, isString(label) ? label : label());
    };

  return html`
    <media-menu class=${`vds-${camelToKebabCase(type)}-menu vds-menu`}>
      ${DefaultMenuButton({ label: $label, hint: $hint })}
      <media-menu-items class="vds-menu-items">
        ${DefaultRadioGroup({
          value: $currentValue,
          options: radioOptions,
          onChange({ detail: value }) {
            $currentValue.set(value);
            notify();
          },
        })}
      </media-menu-items>
    </media-menu>
  `;
}
