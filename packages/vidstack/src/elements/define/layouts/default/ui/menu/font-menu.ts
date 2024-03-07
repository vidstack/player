import { html } from 'lit-html';
import { createContext, onDispose, provideContext, signal, useContext } from 'maverick.js';
import { isString } from 'maverick.js/std';

import { type DefaultLayoutTranslations, type MediaPlayer } from '../../../../../../components';
import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../../../core/api/media-context';
import { hexToRgb } from '../../../../../../utils/color';
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

const COLOR_OPTION: FontOption = {
    type: 'color',
  },
  FONT_FAMILY_OPTION: FontOption = {
    type: 'radio',
    values: {
      'Monospaced Serif': 'mono-serif',
      'Proportional Serif': 'pro-serif',
      'Monospaced Sans-Serif': 'mono-sans',
      'Proportional Sans-Serif': 'pro-sans',
      Casual: 'casual',
      Cursive: 'cursive',
      'Small Capitals': 'capitals',
    },
  },
  FONT_SIZE_OPTION: FontOption = {
    type: 'slider',
    min: 0,
    max: 400,
    step: 25,
    upIcon: 'menu-font-size-up',
    downIcon: 'menu-font-size-down',
  },
  OPACITY_OPTION: FontOption = {
    type: 'slider',
    min: 0,
    max: 100,
    step: 5,
    upIcon: 'menu-opacity-up',
    downIcon: 'menu-opacity-down',
  },
  TEXT_SHADOW_OPTION: FontOption = {
    type: 'radio',
    values: ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'],
  };

const resetContext = createContext<{
  all: Set<() => void>;
}>();

export function DefaultFontMenu() {
  return $signal(() => {
    const { hasCaptions } = useMediaState(),
      { translations } = useDefaultLayoutContext();

    if (!hasCaptions()) return null;

    provideContext(resetContext, {
      all: new Set<() => void>(),
    });

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
    group: 'font',
    label: 'Family',
    option: FONT_FAMILY_OPTION,
    defaultValue: 'pro-sans',
    cssVarName: 'font-family',
    getCssVarValue(value, player) {
      const fontVariant = value === 'capitals' ? 'small-caps' : '';
      player.el?.style.setProperty('--media-user-font-variant', fontVariant);
      return getFontFamilyCSSVarValue(value);
    },
  });
}

function DefaultFontSizeSlider() {
  return DefaultFontSetting({
    group: 'font',
    label: 'Size',
    option: FONT_SIZE_OPTION,
    defaultValue: '100%',
    cssVarName: 'font-size',
    getCssVarValue: percentToRatio,
  });
}

function DefaultTextColorInput() {
  return DefaultFontSetting({
    group: 'text',
    label: 'Color',
    option: COLOR_OPTION,
    defaultValue: '#ffffff',
    cssVarName: 'text-color',
    getCssVarValue(value) {
      return `rgb(${hexToRgb(value)} / var(--media-user-text-opacity, 1))`;
    },
  });
}

function DefaultTextOpacitySlider() {
  return DefaultFontSetting({
    group: 'text',
    label: 'Opacity',
    option: OPACITY_OPTION,
    defaultValue: '100%',
    cssVarName: 'text-opacity',
    getCssVarValue: percentToRatio,
  });
}

function DefaultTextShadowMenu() {
  return DefaultFontSetting({
    group: 'text',
    label: 'Shadow',
    option: TEXT_SHADOW_OPTION,
    defaultValue: 'none',
    cssVarName: 'text-shadow',
    getCssVarValue: getTextShadowCssVarValue,
  });
}

function DefaultTextBgInput() {
  return DefaultFontSetting({
    group: 'text-bg',
    label: 'Color',
    option: COLOR_OPTION,
    defaultValue: '#000000',
    cssVarName: 'text-bg',
    getCssVarValue(value) {
      return `rgb(${hexToRgb(value)} / var(--media-user-text-bg-opacity, 1))`;
    },
  });
}

function DefaultTextBgOpacitySlider() {
  return DefaultFontSetting({
    group: 'text-bg',
    label: 'Opacity',
    option: OPACITY_OPTION,
    defaultValue: '100%',
    cssVarName: 'text-bg-opacity',
    getCssVarValue: percentToRatio,
  });
}

function DefaultDisplayBgInput() {
  return DefaultFontSetting({
    group: 'display',
    label: 'Color',
    option: COLOR_OPTION,
    defaultValue: '#000000',
    cssVarName: 'display-bg',
    getCssVarValue(value) {
      return `rgb(${hexToRgb(value)} / var(--media-user-display-bg-opacity, 1))`;
    },
  });
}

function DefaultDisplayOpacitySlider() {
  return DefaultFontSetting({
    group: 'display',
    label: 'Opacity',
    option: OPACITY_OPTION,
    defaultValue: '0%',
    cssVarName: 'display-bg-opacity',
    getCssVarValue: percentToRatio,
  });
}

function DefaultResetMenuItem() {
  const { translations } = useDefaultLayoutContext(),
    $label = () => i18n(translations, 'Reset'),
    resets = useContext(resetContext);

  function onClick() {
    resets.all.forEach((reset) => reset());
  }

  return html`
    <button class="vds-menu-item" role="menuitem" @click=${onClick}>
      <span class="vds-menu-item-label">${$signal($label)}</span>
    </button>
  `;
}

interface FontRadioOption {
  type: 'radio';
  values: string[] | Record<string, string>;
}

interface FontSliderOption {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  upIcon: string;
  downIcon: string;
}

interface FontColorOption {
  type: 'color';
}

type FontOption = FontRadioOption | FontSliderOption | FontColorOption;

interface DefaultFontSettingProps {
  group: string;
  label: keyof DefaultLayoutTranslations;
  option: FontOption;
  cssVarName: string;
  getCssVarValue?(value: string, player: MediaPlayer): string;
  defaultValue: string;
}

function DefaultFontSetting({
  group,
  label,
  option,
  defaultValue,
  cssVarName,
  getCssVarValue,
}: DefaultFontSettingProps) {
  const { player } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    resets = useContext(resetContext),
    key = `${group}-${label.toLowerCase()}`,
    $value = signal(defaultValue),
    $label = () => i18n(translations, label);

  const savedValue = localStorage.getItem(`vds-player:${key}`);
  if (savedValue) onValueChange(savedValue);

  function onValueChange(value: string) {
    $value.set(value);
    localStorage.setItem(`vds-player:${key}`, value);
    player.el?.style.setProperty(
      `--media-user-${cssVarName}`,
      getCssVarValue?.(value, player) ?? value,
    );
  }

  resets.all.add(onReset);
  onDispose(() => void resets.all.delete(onReset));

  function onReset() {
    onValueChange(defaultValue);
    notify();
  }

  function notify() {
    player.dispatchEvent(new Event('vds-font-change'));
  }

  if (option.type === 'color') {
    function onColorChange(event) {
      onValueChange(event.target.value);
      notify();
    }

    return DefaultMenuItem({
      label: $signal($label),
      children: html`
        <input
          class="vds-color-picker"
          type="color"
          .value=${$signal($value)}
          @input=${onColorChange}
        />
      `,
    });
  }

  if (option.type === 'slider') {
    const { min, max, step, upIcon, downIcon } = option;

    function onSliderValueChange(event) {
      onValueChange(event.detail + '%');
      notify();
    }

    return DefaultMenuSliderItem({
      label: $signal($label),
      value: $signal($value),
      upIcon,
      downIcon,
      isMin: () => $value() === min + '%',
      isMax: () => $value() === max + '%',
      children: html`
        <media-slider
          class="vds-slider"
          min=${min}
          max=${max}
          step=${step}
          key-step=${step}
          .value=${$signal(() => parseInt($value()))}
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
      const value = $value(),
        label = radioOptions.find((radio) => radio.value === value)?.label || '';
      return i18n(translations, isString(label) ? label : label());
    };

  return html`
    <media-menu class=${`vds-${key}-menu vds-menu`}>
      ${DefaultMenuButton({ label: $label, hint: $hint })}
      <media-menu-items class="vds-menu-items">
        ${DefaultRadioGroup({
          value: $value,
          options: radioOptions,
          onChange({ detail: value }) {
            onValueChange(value);
            notify();
          },
        })}
      </media-menu-items>
    </media-menu>
  `;
}

function percentToRatio(value: string) {
  return (parseInt(value) / 100).toString();
}

function getFontFamilyCSSVarValue(value: string) {
  switch (value) {
    case 'mono-serif':
      return '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';
    case 'mono-sans':
      return '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';
    case 'pro-sans':
      return 'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';
    case 'casual':
      return '"Comic Sans MS", Impact, Handlee, fantasy';
    case 'cursive':
      return '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';
    case 'capitals':
      return '"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps';
    default:
      return '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif';
  }
}

function getTextShadowCssVarValue(value: string) {
  switch (value) {
    case 'drop shadow':
      return 'rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px';
    case 'raised':
      return 'rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px';
    case 'depressed':
      return 'rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px';
    case 'outline':
      return 'rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px';
    default:
      return '';
  }
}
