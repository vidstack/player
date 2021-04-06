/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { StorybookCustomElement, StorybookItem } from '@wcom/cli';
import { dashToPascalCase } from '@wcom/cli/dist/utils/string';

import manifest from '../../storybook.json';
import { isNumber } from '../utils/unit';
import { Callback, PascalCase } from './types';

export const SB_THEME_COLOR = '#ff2A5d';

// TODO: At some point I need to pull this code out into a separate repo to use across different projects.

export function buildStorybookControlsFromManifest(
  tagName: string,
): StorybookArgTypes {
  const element = manifest.tags.find(
    tag => tag.name === tagName,
  ) as StorybookCustomElement<VdsStorybookManifestItem>;

  const argTypes: StorybookArgTypes = {};

  element?.properties
    ?.filter(prop => !prop.readonly)
    .forEach(prop => {
      argTypes[prop.name] = buildStorybookArgTypeFromItem(prop);
    });

  element?.properties
    ?.filter(prop => prop.readonly)
    .forEach(prop => {
      argTypes[prop.name] = {
        control: false,
      };
    });

  element?.events?.forEach(event => {
    const eventName = `on${dashToPascalCase(event.name)}`;
    argTypes[eventName] = {
      action: event.name,
      control: false,
      table: {
        disable: true,
      },
    };
  });

  const noControls = [
    'cssParts',
    'cssProperties',
    'events',
    'methods',
    'slots',
  ] as const;

  noControls.forEach(key => {
    element[key]?.forEach(item => {
      argTypes[item.name] = {
        control: false,
      };
    });
  });

  element?.slots?.forEach(slot => {
    if (!slot.name || slot.name === '') {
      argTypes[slot.name] = {
        name: 'DEFAULT',
        control: false,
      };
    }
  });

  return argTypes;
}

export function buildStorybookArgTypeFromItem(
  item: VdsStorybookManifestItem,
): StorybookArgType {
  return {
    control: {
      type: inferControlType(item),
    },
    labels: getItemLabels(item),
    options: getItemOptions(item),
    defaultValue: getItemDefaultValue(item),
  };
}

function isSelectItem(item: VdsStorybookManifestItem): boolean {
  const typeText = item.typeInfo!.text;
  const originalType = item.typeInfo!.original;
  const resolvedType = item.typeInfo!.resolved;
  // Catch string/number union types such as 'a' | 'b' | 'c'.
  return (
    item.enum ||
    (/(string|number)/.test(typeText) &&
      originalType !== typeText &&
      resolvedType.includes('|'))
  );
}

function getItemLabels(item: VdsStorybookManifestItem): string[] | undefined {
  if (!isSelectItem(item)) return undefined;
  return item.enum ? item.labels : undefined;
}

function getItemOptions(
  item: VdsStorybookManifestItem,
): (string | number)[] | undefined {
  if (!isSelectItem(item)) return undefined;
  return item.enum
    ? item.options
    : resolvedTypeToArray(item.typeInfo!.resolved as string);
}

const nukeQuotes = (text: string): string => text.replace(/('|")/g, '');

const resolvedTypeToArray = (text: string): (string | number)[] =>
  nukeQuotes(text.replace(/\\"/g, '')).split(' | ');

function getItemDefaultValue(item: VdsStorybookManifestItem): unknown {
  const controlType = inferControlType(item);
  const defaultValue = nukeQuotes((item.default ?? '') as string);

  if (defaultValue === '' || defaultValue === 'undefined') {
    return undefined;
  } else if (controlType === StorybookControlType.Text) {
    return defaultValue;
  } else if (controlType === StorybookControlType.Number)
    return Number(defaultValue);
  else if (controlType === StorybookControlType.Boolean) {
    return defaultValue === 'true';
  } else if (controlType === StorybookControlType.Select) {
    return item.typeInfo!.text === 'string' || !isNumber(item.options?.[0])
      ? defaultValue
      : Number(defaultValue);
  }

  return undefined;
}

function inferControlType(
  item: VdsStorybookManifestItem,
): StorybookControlType | undefined {
  const resolvedType = item.typeInfo!.resolved;

  if (isSelectItem(item)) {
    return StorybookControlType.Select;
  } else if (resolvedType.includes('string')) {
    return StorybookControlType.Text;
  } else if (resolvedType.includes('boolean')) {
    return StorybookControlType.Boolean;
  } else if (resolvedType.includes('number')) {
    return StorybookControlType.Number;
  }

  return undefined;
}

export interface VdsStorybookManifestItem extends StorybookItem {
  enum?: boolean;
  readonly?: boolean;
  labels?: string[];
  options?: string[];
  typeInfo?: {
    text: string;
    original: string;
    resolved: string;
  };
}

export type StorybookArgTypes = Record<string, StorybookArgType>;

export interface StorybookArgType {
  name?: string;
  control?: StorybookControl;
  defaultValue?: unknown;
  labels?: string[];
  action?: string;
  options?: (string | number)[];
  table?: {
    disable?: boolean;
  };
}

export type StorybookControl =
  | false
  | StorybookControlType
  | {
      type?: StorybookControlType;
      disable?: boolean;
    };

/**
 * @link https://storybook.js.org/docs/react/essentials/controls#annotation
 */
export enum StorybookControlType {
  /**
   * Checkbox input.
   */
  Boolean = 'boolean',

  /**
   * A numeric text box input.
   */
  Number = 'number',

  /**
   * A range slider input.
   */
  Range = 'range',

  /**
   * JSON editor text input.
   */
  Object = 'object',

  /**
   * JSON editor text input.
   */
  Array = 'object',

  /**
   * A file input that gives you an array of URLs.
   */
  File = 'file',

  /**
   * Radio buttons input.
   */
  Radio = 'radio',

  /**
   * Inline radio buttons input.
   */
  InlineRadio = 'inline-radio',

  /**
   * Multi-select checkbox input.
   */
  Check = 'check',

  /**
   * Multi-select inline checkbox input.
   */
  InlineCheck = 'inline-check',

  /**
   * Select dropdown input.
   */
  Select = 'select',

  /**
   * Multi-select dropdown input.
   */
  MultiSelect = 'multi-select',

  /**
   * Simple text input.
   */
  Text = 'text',

  /**
   * Color picker input that assumes strings are color values.
   */
  Color = 'color',

  /**
   * Date picker input.
   */
  Date = 'date',
}

export type VdsEventsToStorybookActions<T> = {
  [P in keyof T as `on${PascalCase<P & string>}`]: Callback<T[P]>;
};
