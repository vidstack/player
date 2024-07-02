import { signal, type WriteSignal } from 'maverick.js';
import { camelToKebabCase, isString } from 'maverick.js/std';

import type { DefaultLayoutTranslations } from '../../components/layouts/default/translations';

export const FONT_COLOR_OPTION: FontOption = {
  type: 'color',
};

export const FONT_FAMILY_OPTION: FontOption = {
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
};

export const FONT_SIZE_OPTION: FontSliderOption = {
  type: 'slider',
  min: 0,
  max: 400,
  step: 25,
  upIcon: null,
  downIcon: null,
};

export const FONT_OPACITY_OPTION: FontSliderOption = {
  type: 'slider',
  min: 0,
  max: 100,
  step: 5,
  upIcon: null,
  downIcon: null,
};

export const FONT_TEXT_SHADOW_OPTION: FontOption = {
  type: 'radio',
  values: ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'],
};

export const FONT_DEFAULTS = {
  fontFamily: 'pro-sans',
  fontSize: '100%',
  textColor: '#ffffff',
  textOpacity: '100%',
  textShadow: 'none',
  textBg: '#000000',
  textBgOpacity: '100%',
  displayBg: '#000000',
  displayBgOpacity: '0%',
} as const;

export const FONT_SIGNALS = Object.keys(FONT_DEFAULTS).reduce(
  (prev, type) => ({
    ...prev,
    [type]: signal(FONT_DEFAULTS[type]),
  }),
  {} as Record<FontSignal, WriteSignal<string>>,
);

export type FontSignal = keyof typeof FONT_DEFAULTS;

if (!__SERVER__) {
  for (const type of Object.keys(FONT_SIGNALS)) {
    const value = localStorage.getItem(`vds-player:${camelToKebabCase(type)}`);
    if (isString(value)) FONT_SIGNALS[type].set(value);
  }
}

export function onFontReset() {
  for (const type of Object.keys(FONT_SIGNALS)) {
    const defaultValue = FONT_DEFAULTS[type];
    FONT_SIGNALS[type].set(defaultValue);
  }
}

export interface FontRadioOption {
  type: 'radio';
  values: string[] | Record<string, string>;
}

export interface FontSliderOption {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  upIcon: unknown;
  downIcon: unknown;
}

export interface FontColorOption {
  type: 'color';
}

export type FontOption = FontRadioOption | FontSliderOption | FontColorOption;

export interface DefaultFontSettingProps {
  label: keyof DefaultLayoutTranslations;
  type: FontSignal;
  option: FontOption;
}
