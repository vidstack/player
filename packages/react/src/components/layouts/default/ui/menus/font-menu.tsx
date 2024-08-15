import * as React from 'react';

import { useSignal } from 'maverick.js/react';
import { camelToKebabCase } from 'maverick.js/std';
import {
  FONT_COLOR_OPTION,
  FONT_FAMILY_OPTION,
  FONT_OPACITY_OPTION,
  FONT_SIGNALS,
  FONT_SIZE_OPTION,
  FONT_TEXT_SHADOW_OPTION,
  onFontReset,
  type DefaultFontSettingProps,
  type FontRadioOption,
  type FontSliderOption,
} from 'vidstack/exports/font.ts';

import { useMediaPlayer } from '../../../../../hooks/use-media-player';
import { useMediaState } from '../../../../../hooks/use-media-state';
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
 * DefaultFontMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontMenu() {
  const label = useDefaultLayoutWord('Caption Styles'),
    $hasCaptions = useMediaState('hasCaptions'),
    fontSectionLabel = useDefaultLayoutWord('Font'),
    textSectionLabel = useDefaultLayoutWord('Text'),
    textBgSectionLabel = useDefaultLayoutWord('Text Background'),
    displayBgSectionLabel = useDefaultLayoutWord('Display Background');

  if (!$hasCaptions) return null;

  return (
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
  );
}

DefaultFontMenu.displayName = 'DefaultFontMenu';
export { DefaultFontMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultFontFamilyMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontFamilyMenu() {
  return <DefaultFontSetting label="Family" type="fontFamily" option={FONT_FAMILY_OPTION} />;
}

DefaultFontFamilyMenu.displayName = 'DefaultFontFamilyMenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSizeSlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontSizeSlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    option: FontSliderOption = {
      ...FONT_SIZE_OPTION,
      upIcon: Icons.Menu.FontSizeUp,
      downIcon: Icons.Menu.FontSizeDown,
    };

  return <DefaultFontSetting label="Size" type="fontSize" option={option} />;
}

DefaultFontSizeSlider.displayName = 'DefaultFontSizeSlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextColoInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextColorInput() {
  return <DefaultFontSetting label="Color" type="textColor" option={FONT_COLOR_OPTION} />;
}

DefaultTextColorInput.displayName = 'DefaultTextColorInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    option = {
      ...FONT_OPACITY_OPTION,
      upIcon: Icons.Menu.OpacityUp,
      downIcon: Icons.Menu.OpacityDown,
    };
  return <DefaultFontSetting label="Opacity" type="textOpacity" option={option} />;
}

DefaultTextOpacitySlider.displayName = 'DefaultTextOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextShadowMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextShadowMenu() {
  return <DefaultFontSetting label="Shadow" type="textShadow" option={FONT_TEXT_SHADOW_OPTION} />;
}

DefaultTextShadowMenu.displayName = 'DefaultTextShadowMenu';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgInput() {
  return <DefaultFontSetting label="Color" type="textBg" option={FONT_COLOR_OPTION} />;
}

DefaultTextBgInput.displayName = 'DefaultTextBgInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultTextBgOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultTextBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    option = {
      ...FONT_OPACITY_OPTION,
      upIcon: Icons.Menu.OpacityUp,
      downIcon: Icons.Menu.OpacityDown,
    };

  return <DefaultFontSetting label="Opacity" type="textBgOpacity" option={option} />;
}

DefaultTextBgOpacitySlider.displayName = 'DefaultTextBgOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgInput
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgInput() {
  return <DefaultFontSetting label="Color" type="displayBg" option={FONT_COLOR_OPTION} />;
}

DefaultDisplayBgInput.displayName = 'DefaultDisplayBgInput';

/* -------------------------------------------------------------------------------------------------
 * DefaultDisplayBgOpacitySlider
 * -----------------------------------------------------------------------------------------------*/

function DefaultDisplayBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(),
    option = {
      ...FONT_OPACITY_OPTION,
      upIcon: Icons.Menu.OpacityUp,
      downIcon: Icons.Menu.OpacityDown,
    };

  return <DefaultFontSetting label="Opacity" type="displayBgOpacity" option={option} />;
}

DefaultDisplayBgOpacitySlider.displayName = 'DefaultDisplayBgOpacitySlider';

/* -------------------------------------------------------------------------------------------------
 * DefaultFontSetting
 * -----------------------------------------------------------------------------------------------*/

function DefaultFontSetting({ label, option, type }: DefaultFontSettingProps) {
  const player = useMediaPlayer(),
    $currentValue = FONT_SIGNALS[type],
    $value = useSignal($currentValue),
    translatedLabel = useDefaultLayoutWord(label);

  const notify = React.useCallback(() => {
    player?.dispatchEvent(new Event('vds-font-change'));
  }, [player]);

  const onChange = React.useCallback(
    (newValue: string) => {
      $currentValue.set(newValue);
      notify();
    },
    [$currentValue, notify],
  );

  if (option.type === 'color') {
    function onColorChange(event) {
      onChange(event.target.value);
    }

    return (
      <DefaultMenuItem label={translatedLabel}>
        <input className="vds-color-picker" type="color" value={$value} onChange={onColorChange} />
      </DefaultMenuItem>
    );
  }

  if (option.type === 'slider') {
    const { min, max, step, upIcon, downIcon } = option;

    function onSliderValueChange(value) {
      onChange(value + '%');
    }

    return (
      <DefaultMenuSliderItem
        label={translatedLabel}
        value={$value}
        UpIcon={upIcon as DefaultLayoutIcon}
        DownIcon={downIcon as DefaultLayoutIcon}
        isMin={$value === min + '%'}
        isMax={$value === max + '%'}
      >
        <Slider.Root
          className="vds-slider"
          min={min}
          max={max}
          step={step}
          keyStep={step}
          value={parseInt($value)}
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
        id={camelToKebabCase(type)}
        label={translatedLabel}
        value={$value}
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
  const resetText = useDefaultLayoutWord('Reset');

  return (
    <button className="vds-menu-item" role="menuitem" onClick={onFontReset}>
      <span className="vds-menu-item-label">{resetText}</span>
    </button>
  );
}

DefaultResetMenuItem.displayName = 'DefaultResetMenuItem';
