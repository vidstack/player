import { html } from 'lit-html';
import { createContext, onDispose, provideContext, signal, useContext } from 'maverick.js';
import { isString } from 'maverick.js/std';

import { type DefaultLayoutTranslations, type MediaPlayer } from '../../../../../../components';
import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaContext, useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { createRadioOptions, renderMenuButton, renderRadioGroup } from './items/menu-items';

const COLOR_OPTIONS = ['White', 'Yellow', 'Green', 'Cyan', 'Blue', 'Magenta', 'Red', 'Black'],
  OPACITY_OPTIONS = ['0%', '25%', '50%', '75%', '100%'],
  FONT_FAMILY_OPTIONS = {
    'Monospaced Serif': 'mono-serif',
    'Proportional Serif': 'pro-serif',
    'Monospaced Sans-Serif': 'mono-sans',
    'Proportional Sans-Serif': 'pro-sans',
    Casual: 'casual',
    Cursive: 'cursive',
    'Small Capitals': 'capitals',
  },
  FONT_SIZE_OPTIONS = ['50%', '75%', '100%', '150%', '200%', '300%', '400%'],
  TEXT_SHADOW_OPTIONS = ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'];

const resetContext = createContext<{ current?(): void; all: Set<() => void> }>();

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
        ${renderMenuButton({
          label: () => i18n(translations, 'Caption Styles'),
        })}
        <media-menu-items class="vds-menu-items">
          ${DefaultFontFamilyMenu()}${DefaultFontSizeMenu()}${DefaultTextColorMenu()}${DefaultTextOpacityMenu()}${DefaultTextShadowMenu()}
          ${DefaultTextBgMenu()}${DefaultTextBgOpacityMenu()}${DefaultDisplayBgMenu()}
          ${DefaultDisplayOpacityMenu()}${DefaultResetMenuItem()}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultFontFamilyMenu() {
  return DefaultFontSettingMenu({
    label: 'Font Family',
    options: FONT_FAMILY_OPTIONS,
    defaultValue: 'pro-sans',
    cssVarName: 'font-family',
    getCssVarValue(value, player) {
      const fontVariant = value === 'capitals' ? 'small-caps' : '';
      player.el?.style.setProperty('--media-user-font-variant', fontVariant);
      return getFontFamilyCSSVarValue(value);
    },
  });
}

function DefaultFontSizeMenu() {
  return DefaultFontSettingMenu({
    label: 'Font Size',
    options: FONT_SIZE_OPTIONS,
    defaultValue: '100%',
    cssVarName: 'font-size',
    getCssVarValue: percentToRatio,
  });
}

function DefaultTextColorMenu() {
  return DefaultFontSettingMenu({
    label: 'Text Color',
    options: COLOR_OPTIONS,
    defaultValue: 'white',
    cssVarName: 'text-color',
    getCssVarValue(value) {
      return `rgb(${toRGB(value)} / var(--media-user-text-opacity, 1))`;
    },
  });
}

function DefaultTextOpacityMenu() {
  return DefaultFontSettingMenu({
    label: 'Text Opacity',
    options: OPACITY_OPTIONS,
    defaultValue: '100%',
    cssVarName: 'text-opacity',
    getCssVarValue: percentToRatio,
  });
}

function DefaultTextShadowMenu() {
  return DefaultFontSettingMenu({
    label: 'Text Shadow',
    options: TEXT_SHADOW_OPTIONS,
    defaultValue: 'none',
    cssVarName: 'text-shadow',
    getCssVarValue: getTextShadowCssVarValue,
  });
}

function DefaultTextBgMenu() {
  return DefaultFontSettingMenu({
    label: 'Background Color',
    options: COLOR_OPTIONS,
    defaultValue: 'black',
    cssVarName: 'text-bg',
    getCssVarValue(value) {
      return `rgb(${toRGB(value)} / var(--media-user-text-bg-opacity, 1))`;
    },
  });
}

function DefaultTextBgOpacityMenu() {
  return DefaultFontSettingMenu({
    label: 'Background Opacity',
    options: OPACITY_OPTIONS,
    defaultValue: '100%',
    cssVarName: 'text-bg-opacity',
    getCssVarValue: percentToRatio,
  });
}

function DefaultDisplayBgMenu() {
  return DefaultFontSettingMenu({
    label: 'Display Background Color',
    options: COLOR_OPTIONS,
    defaultValue: 'black',
    cssVarName: 'display-bg',
    getCssVarValue(value) {
      return `rgb(${toRGB(value)} / var(--media-user-display-bg-opacity, 1))`;
    },
  });
}

function DefaultDisplayOpacityMenu() {
  return DefaultFontSettingMenu({
    label: 'Display Background Opacity',
    options: OPACITY_OPTIONS,
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
    resets.current ? resets.current() : resets.all.forEach((reset) => reset());
  }

  return html`
    <button class="vds-menu-button" role="menuitem" @click=${onClick}>
      <span class="vds-menu-button-label">${$signal($label)}</span>
    </button>
  `;
}

function DefaultFontSettingMenu({
  label,
  options,
  defaultValue,
  cssVarName,
  getCssVarValue,
}: {
  label: keyof DefaultLayoutTranslations;
  options: string[] | Record<string, string>;
  cssVarName: string;
  getCssVarValue?(value: string, player: MediaPlayer): string;
  defaultValue: string;
}) {
  const { player } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    resets = useContext(resetContext),
    radioOptions = createRadioOptions(options),
    key = `${label.toLowerCase().replace(/\s/g, '-')}`,
    $value = signal(defaultValue),
    $label = () => i18n(translations, label),
    $hint = () => {
      const value = $value(),
        label = radioOptions.find((radio) => radio.value === value)?.label || '';
      return i18n(translations, isString(label) ? label : label());
    };

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

  function onOpen() {
    resets.current = onReset;
  }

  function onClose() {
    resets.current = undefined;
  }

  return html`
    <media-menu class=${`vds-${key}-menu vds-menu`} @open=${onOpen} @close=${onClose}>
      ${renderMenuButton({ label: $label, hint: $hint })}
      <media-menu-items class="vds-menu-items">
        ${renderRadioGroup({
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

function toRGB(color: string) {
  switch (color) {
    case 'white':
      return '255 255 255';
    case 'yellow':
      return '255 255 0';
    case 'green':
      return '0 128 0';
    case 'cyan':
      return '0 255 255';
    case 'blue':
      return '0 0 255';
    case 'magenta':
      return '255 0 255';
    case 'red':
      return '255 0 0';
    case 'black':
      return '0 0 0';
  }
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
