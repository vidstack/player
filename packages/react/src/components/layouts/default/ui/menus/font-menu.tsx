import * as React from 'react';

import type { DefaultLayoutTranslations } from 'vidstack';

import { useMediaPlayer } from '../../../../../hooks/use-media-player';
import { useMediaState } from '../../../../../hooks/use-media-state';
import type { MediaPlayerInstance } from '../../../../primitives/instances';
import * as Menu from '../../../../ui/menu';
import * as Slider from '../../../../ui/sliders/slider';
import { i18n, useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import type { DefaultLayoutIcon } from '../../icons';
import {
  createRadioOptions,
  DefaultMenuButton,
  DefaultMenuItem,
  DefaultMenuRadioGroup,
  DefaultMenuSection,
} from './items/menu-items';
import { DefaultMenuSliderItem, DefaultSliderParts, DefaultSliderSteps } from './items/menu-slider';

/* -------------------------------------------------------------------------------------------------
 * Options
 * -----------------------------------------------------------------------------------------------*/

const COLOR_OPTION = {
    type: 'color',
  } as const,
  FONT_FAMILY_OPTION = {
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
  } as const,
  FONT_SIZE_OPTION = {
    type: 'slider',
    min: 0,
    max: 400,
    step: 25,
  } as const,
  OPACITY_OPTION = {
    type: 'slider',
    min: 0,
    max: 100,
    step: 5,
  } as const,
  TEXT_SHADOW_OPTION = {
    type: 'radio',
    values: ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'] as string[],
  } as const;

interface FontReset {
  all: Set<() => void>;
}

const FontResetContext = React.createContext<FontReset>({ all: new Set() });
FontResetContext.displayName = 'FontResetContext';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontMenu() {
  const label = useDefaultLayoutWord('Caption Styles'),
    $hasCaptions = useMediaState('hasCaptions'),
    resets = React.useMemo<FontReset>(() => ({ all: new Set() }), []),
    fontSectionLabel = useDefaultLayoutWord('Font'),
    textSectionLabel = useDefaultLayoutWord('Text'),
    textBgSectionLabel = useDefaultLayoutWord('Text Background'),
    displayBgSectionLabel = useDefaultLayoutWord('Display Background');

  if (!$hasCaptions) return null;

  return (
    <FontResetContext.Provider value={resets}>
      <Menu.Root className="vds-font-menu vds-menu">
        <DefaultMenuButton label={label} />
        <Menu.Content className="vds-font-style-items vds-menu-items">
          <DefaultMenuSection label={fontSectionLabel}>
            <DefaultFontFamilyMenu />
            <DefaultFontSizeSlider />
          </DefaultMenuSection>

          <DefaultMenuSection label={textSectionLabel}>
            <DefaultTextColorInput />
            <DefaultTextShadowMenu />
            <DefaultTextOpacitySlider />
          </DefaultMenuSection>

          <DefaultMenuSection label={textBgSectionLabel}>
            <DefaultTextBgInput />
            <DefaultTextBgOpacitySlider />
          </DefaultMenuSection>

          <DefaultMenuSection label={displayBgSectionLabel}>
            <DefaultDisplayBgInput />
            <DefaultDisplayBgOpacitySlider />
          </DefaultMenuSection>

          <DefaultMenuSection>
            <DefaultResetMenuItem />
          </DefaultMenuSection>
        </Menu.Content>
      </Menu.Root>
    </FontResetContext.Provider>
  );
}

DefaultFontMenu.displayName = 'DefaultFontMenu';
export { DefaultFontMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultFontFamilyMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontFamilyMenu() {
  return (
    <DefaultFontSetting
      group="font"
      label="Family"
      option={FONT_FAMILY_OPTION}
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

DefaultFontFamilyMenu.displayName = 'DefaultFontFamilyMenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSizeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontSizeSlider() {
  const { icons: Icons } = useDefaultLayoutContext();
  return (
    <DefaultFontSetting
      group="font"
      label="Size"
      option={{
        ...FONT_SIZE_OPTION,
        UpIcon: Icons.Menu.FontSizeUp,
        DownIcon: Icons.Menu.FontSizeDown,
      }}
      defaultValue="100%"
      cssVarName="font-size"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultFontSizeSlider.displayName = 'DefaultFontSizeSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextColoInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextColorInput() {
  return (
    <DefaultFontSetting
      group="text"
      label="Color"
      option={COLOR_OPTION}
      defaultValue="#ffffff"
      cssVarName="text-color"
      getCssVarValue={(value) => {
        return `rgb(${hexToRGB(value)} / var(--media-user-text-opacity, 1))`;
      }}
    />
  );
}

DefaultTextColorInput.displayName = 'DefaultTextColorInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext();
  return (
    <DefaultFontSetting
      group="text"
      label="Opacity"
      option={{
        ...OPACITY_OPTION,
        UpIcon: Icons.Menu.OpacityUp,
        DownIcon: Icons.Menu.OpacityDown,
      }}
      defaultValue="100%"
      cssVarName="text-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultTextOpacitySlider.displayName = 'DefaultTextOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextShadowMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextShadowMenu() {
  return (
    <DefaultFontSetting
      group="text"
      label="Shadow"
      option={TEXT_SHADOW_OPTION}
      defaultValue="none"
      cssVarName="text-shadow"
      getCssVarValue={getTextShadowCssVarValue}
    />
  );
}

DefaultTextShadowMenu.displayName = 'DefaultTextShadowMenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgInput() {
  return (
    <DefaultFontSetting
      group="text-bg"
      label="Color"
      option={COLOR_OPTION}
      defaultValue="#000000"
      cssVarName="text-bg"
      getCssVarValue={(value) => {
        return `rgb(${hexToRGB(value)} / var(--media-user-text-bg-opacity, 1))`;
      }}
    />
  );
}

DefaultTextBgInput.displayName = 'DefaultTextBgInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext();
  return (
    <DefaultFontSetting
      group="text-bg"
      label="Opacity"
      option={{ ...OPACITY_OPTION, UpIcon: Icons.Menu.OpacityUp, DownIcon: Icons.Menu.OpacityDown }}
      defaultValue="100%"
      cssVarName="text-bg-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultTextBgOpacitySlider.displayName = 'DefaultTextBgOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgInput() {
  return (
    <DefaultFontSetting
      group="display-bg"
      label="Color"
      option={COLOR_OPTION}
      defaultValue="#000000"
      cssVarName="display-bg"
      getCssVarValue={(value) => {
        return `rgb(${hexToRGB(value)} / var(--media-user-display-bg-opacity, 1))`;
      }}
    />
  );
}

DefaultDisplayBgInput.displayName = 'DefaultDisplayBgInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext();
  return (
    <DefaultFontSetting
      group="display-bg"
      label="Opacity"
      option={{
        ...OPACITY_OPTION,
        UpIcon: Icons.Menu.OpacityUp,
        DownIcon: Icons.Menu.OpacityDown,
      }}
      defaultValue="0%"
      cssVarName="display-bg-opacity"
      getCssVarValue={percentToRatio}
    />
  );
}

DefaultDisplayBgOpacitySlider.displayName = 'DefaultDisplayBgOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSetting
 * -----------------------------------------------------------------------------------------------*/

interface FontRadioOption {
  type: 'radio';
  values: string[] | Record<string, string>;
}

interface FontSliderOption {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  UpIcon?: DefaultLayoutIcon;
  DownIcon?: DefaultLayoutIcon;
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
  getCssVarValue?(value: string, player: MediaPlayerInstance): string;
  defaultValue: string;
}

function DefaultFontSetting({
  group,
  label,
  option,
  cssVarName,
  getCssVarValue,
  defaultValue,
}: DefaultFontSettingProps) {
  const player = useMediaPlayer(),
    id = `${group}-${label.toLowerCase()}`,
    translatedLabel = useDefaultLayoutWord(label),
    resets = React.useContext(FontResetContext);

  const [value, setValue] = React.useState(defaultValue);

  const update = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      localStorage.setItem(`vds-player:${id}`, newValue);
      player?.el?.style.setProperty(
        `--media-user-${cssVarName}`,
        getCssVarValue?.(newValue, player) ?? newValue,
      );
    },
    [player],
  );

  const notify = React.useCallback(() => {
    player?.dispatchEvent(new Event('vds-font-change'));
  }, [player]);

  const onChange = React.useCallback(
    (newValue: string) => {
      update(newValue);
      notify();
    },
    [update, notify],
  );

  const onReset = React.useCallback(() => {
    onChange(defaultValue);
  }, [onChange]);

  React.useEffect(() => {
    const savedValue = localStorage.getItem(`vds-player:${id}`);
    if (savedValue) update(savedValue);
  }, []);

  React.useEffect(() => {
    resets.all.add(onReset);
    return () => void resets.all.delete(onReset);
  }, [onReset]);

  if (option.type === 'color') {
    function onColorChange(event) {
      onChange(event.target.value);
    }

    return (
      <DefaultMenuItem label={translatedLabel}>
        <input className="vds-color-picker" type="color" value={value} onChange={onColorChange} />
      </DefaultMenuItem>
    );
  }

  if (option.type === 'slider') {
    const { min, max, step, UpIcon, DownIcon } = option;

    function onSliderValueChange(value) {
      onChange(value + '%');
    }

    return (
      <DefaultMenuSliderItem
        label={translatedLabel}
        value={value}
        UpIcon={UpIcon}
        DownIcon={DownIcon}
        isMin={value === min + '%'}
        isMax={value === max + '%'}
      >
        <Slider.Root
          className="vds-slider"
          min={min}
          max={max}
          step={step}
          keyStep={step}
          value={parseInt(value)}
          aria-label={translatedLabel}
          onValueChange={onSliderValueChange}
          onDragValueChange={onSliderValueChange}
        >
          <DefaultSliderParts />
          <DefaultSliderSteps />
        </Slider.Root>
      </DefaultMenuSliderItem>
    );
  }

  if (option.type === 'radio') {
    return (
      <DefaultFontRadioGroup
        id={id}
        label={translatedLabel}
        value={value}
        values={option.values}
        onChange={onChange}
      />
    );
  }

  return null;
}

DefaultFontSetting.displayName = 'DefaultFontSetting';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontRadioGroup
 * -----------------------------------------------------------------------------------------------*/

interface DefaultFontRadioGroupProps {
  id: string;
  label: string;
  value: string;
  values: FontRadioOption['values'];
  onChange: (value: string) => void;
}

function DefaultFontRadioGroup({ id, label, value, values, onChange }: DefaultFontRadioGroupProps) {
  const radioOptions = createRadioOptions(values),
    { translations } = useDefaultLayoutContext(),
    hint = React.useMemo(() => {
      const label = radioOptions.find((radio) => radio.value === value)?.label || '';
      return i18n(translations, label);
    }, [value, radioOptions]);

  return (
    <Menu.Root className={`vds-${id}-menu vds-menu`}>
      <DefaultMenuButton label={label} hint={hint} />
      <Menu.Items className="vds-menu-items">
        <DefaultMenuRadioGroup value={value} options={radioOptions} onChange={onChange} />
      </Menu.Items>
    </Menu.Root>
  );
}

DefaultFontRadioGroup.displayName = 'DefaultFontRadioGroup';

/* -------------------------------------------------------------------------------------------------
 * DefaultResetMenuItem
 * -----------------------------------------------------------------------------------------------*/

function DefaultResetMenuItem() {
  const resetText = useDefaultLayoutWord('Reset'),
    resets = React.useContext(FontResetContext);

  function onClick() {
    resets.all.forEach((reset) => reset());
  }

  return (
    <button className="vds-menu-item" role="menuitem" onClick={onClick}>
      <span className="vds-menu-item-label">{resetText}</span>
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

function hexToRGB(hex: string) {
  const { style } = new Option();
  style.color = hex;
  return style.color.match(/\((.*?)\)/)![1].replace(/,/g, ' ');
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
