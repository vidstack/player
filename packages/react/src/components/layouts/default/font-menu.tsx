import * as React from 'react';

import type { DefaultLayoutTranslations } from 'vidstack';

import { useMediaPlayer } from '../../../hooks/use-media-player';
import { useMediaState } from '../../../hooks/use-media-state';
import type { MediaPlayerInstance } from '../../primitives/instances';
import * as Menu from '../../ui/menu';
import { DefaultLayoutContext, i18n, useDefaultLayoutWord } from './context';
import { createRadioOptions, DefaultMenuRadioGroup, DefaultSubmenuButton } from './menu-layout';

/* -------------------------------------------------------------------------------------------------
 * Options
 * -----------------------------------------------------------------------------------------------*/

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

interface FontReset {
  current?(): void;
  all: Set<() => void>;
}

const FontResetContext = React.createContext<FontReset>({ all: new Set() });
FontResetContext.displayName = 'FontResetContext';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontSubmenu() {
  const { icons: Icons } = React.useContext(DefaultLayoutContext),
    label = useDefaultLayoutWord('Caption Styles'),
    $hasCaptions = useMediaState('hasCaptions'),
    resets = React.useMemo<FontReset>(() => ({ all: new Set() }), []);

  if (!$hasCaptions) return null;

  return (
    <FontResetContext.Provider value={resets}>
      <Menu.Root className="vds-font-menu vds-menu">
        <DefaultSubmenuButton label={label} Icon={Icons.Menu.Font} />
        <Menu.Content className="vds-font-style-items vds-menu-items">
          <DefaultFontFamilySubmenu />
          <DefaultFontSizeSubmenu />
          <DefaultTextColorSubmenu />
          <DefaultTextOpacitySubmenu />
          <DefaultTextShadowSubmenu />
          <DefaultTextBgSubmenu />
          <DefaultTextBgOpacitySubmenu />
          <DefaultDisplayBgSubmenu />
          <DefaultDisplayBgOpacitySubmenu />
          <DefaultResetMenuItem />
        </Menu.Content>
      </Menu.Root>
    </FontResetContext.Provider>
  );
}

DefaultFontSubmenu.displayName = 'DefaultFontSubmenu';
export { DefaultFontSubmenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultFontFamilySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontFamilySubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Font Family"
      options={FONT_FAMILY_OPTIONS}
      defaultValue="pro-sans"
      cssVarName="font-family"
      getCssVarValue={getFontFamilyCSSVarValue}
    />
  );
}

function getFontFamilyCSSVarValue(value: string, player: MediaPlayerInstance) {
  const fontVariant = value === 'capitals' ? 'small-caps' : '';
  player.el?.style.setProperty('--media-user-font-variant', fontVariant);
  return getFontFamily(value);
}

DefaultFontFamilySubmenu.displayName = 'DefaultFontFamilySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSizeSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontSizeSubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Font Size"
      options={FONT_SIZE_OPTIONS}
      defaultValue="100%"
      cssVarName="font-size"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultFontSizeSubmenu.displayName = 'DefaultFontSizeSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextColorSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextColorSubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Text Color"
      options={COLOR_OPTIONS}
      defaultValue="white"
      cssVarName="text-color"
      getCssVarValue={(value) => {
        return `rgb(${toRGB(value)} / var(--media-user-text-opacity, 1))`;
      }}
    />
  );
}

DefaultTextColorSubmenu.displayName = 'DefaultTextColorSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextOpacitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextOpacitySubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Text Opacity"
      options={OPACITY_OPTIONS}
      defaultValue="100%"
      cssVarName="text-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultTextOpacitySubmenu.displayName = 'DefaultTextOpacitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextShadowSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextShadowSubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Text Shadow"
      options={TEXT_SHADOW_OPTIONS}
      defaultValue="none"
      cssVarName="text-shadow"
      getCssVarValue={getTextShadowCssVarValue}
    />
  );
}

DefaultTextShadowSubmenu.displayName = 'DefaultTextShadowSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgSubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Background Color"
      options={COLOR_OPTIONS}
      defaultValue="black"
      cssVarName="text-bg"
      getCssVarValue={(value) => {
        return `rgb(${toRGB(value)} / var(--media-user-text-bg-opacity, 1))`;
      }}
    />
  );
}

DefaultTextBgSubmenu.displayName = 'DefaultTextBgSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgOpacitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgOpacitySubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Background Opacity"
      options={OPACITY_OPTIONS}
      defaultValue="100%"
      cssVarName="text-bg-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultTextBgOpacitySubmenu.displayName = 'DefaultTextBgOpacitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgSubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgSubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Display Background Color"
      options={COLOR_OPTIONS}
      defaultValue="black"
      cssVarName="display-bg"
      getCssVarValue={(value) => {
        return `rgb(${toRGB(value)} / var(--media-user-display-bg-opacity, 1))`;
      }}
    />
  );
}

DefaultDisplayBgSubmenu.displayName = 'DefaultDisplayBgSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgOpacitySubmenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgOpacitySubmenu() {
  return (
    <DefaultFontSettingSubmenu
      label="Display Background Opacity"
      options={OPACITY_OPTIONS}
      defaultValue="0%"
      cssVarName="display-bg-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultDisplayBgOpacitySubmenu.displayName = 'DefaultDisplayBgOpacitySubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSettingSubmenu
 * -----------------------------------------------------------------------------------------------*/

interface DefaultFontSettingSubmenuProps {
  label: keyof DefaultLayoutTranslations;
  options: string[] | Record<string, string>;
  cssVarName: string;
  getCssVarValue?(value: string, player: MediaPlayerInstance): string;
  defaultValue: string;
}

function DefaultFontSettingSubmenu({
  label,
  options,
  cssVarName,
  getCssVarValue,
  defaultValue,
}: DefaultFontSettingSubmenuProps) {
  const player = useMediaPlayer(),
    radioOptions = createRadioOptions(options),
    key = `${label.toLowerCase().replace(/\s/g, '-')}`,
    { translations } = React.useContext(DefaultLayoutContext),
    translatedLabel = useDefaultLayoutWord(label),
    resets = React.useContext(FontResetContext);

  const [value, setValue] = React.useState(defaultValue);

  const hint = React.useMemo(() => {
    const label = radioOptions.find((radio) => radio.value === value)?.label || '';
    return i18n(translations, label);
  }, [value, radioOptions]);

  const onChange = React.useCallback((newValue: string) => {
    setValue(newValue);
    localStorage.setItem(`vds-player:${key}`, newValue);
    player?.el?.style.setProperty(
      `--media-user-${cssVarName}`,
      getCssVarValue?.(newValue, player) ?? newValue,
    );
  }, []);

  const onReset = React.useCallback(() => {
    setValue(defaultValue);
  }, []);

  React.useEffect(() => {
    const savedValue = localStorage.getItem(`vds-player:${key}`);
    if (savedValue) onChange(savedValue);

    resets.all.add(onReset);
    return () => {
      resets.all.delete(onReset);
    };
  }, []);

  function onOpen() {
    resets.current = onReset;
  }

  function onClose() {
    resets.current = undefined;
  }

  return (
    <Menu.Root className={`vds-${key}-menu vds-menu`} onOpen={onOpen} onClose={onClose}>
      <DefaultSubmenuButton label={translatedLabel} hint={hint} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={value} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}

DefaultFontSettingSubmenu.displayName = 'DefaultFontSettingSubmenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultResetMenuItem
 * -----------------------------------------------------------------------------------------------*/

function DefaultResetMenuItem() {
  const resetText = useDefaultLayoutWord('Reset'),
    resets = React.useContext(FontResetContext);

  function onClick() {
    resets.current ? resets.current() : resets.all.forEach((reset) => reset());
  }

  return (
    <button className="vds-menu-button" role="menuitem" onClick={onClick}>
      <span className="vds-menu-button-label">{resetText}</span>
    </button>
  );
}

DefaultResetMenuItem.displayName = 'DefaultResetMenuItem';

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

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

function getFontFamily(value: string) {
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
