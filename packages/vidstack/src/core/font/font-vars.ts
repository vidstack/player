import { effect, onDispose, scoped } from 'maverick.js';
import { camelToKebabCase, keysOf } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';
import { hexToRgb } from '../../utils/color';
import { useMediaContext } from '../api/media-context';
import { FONT_DEFAULTS, FONT_SIGNALS, type FontSignal } from './font-options';

let isWatchingVars = false,
  players = new Set<MediaPlayer>();

export function updateFontCssVars() {
  if (__SERVER__) return;

  const { player } = useMediaContext();
  players.add(player);
  applyFontCssVars(player);
  onDispose(() => players.delete(player));

  if (!isWatchingVars) {
    scoped(() => {
      for (const type of keysOf(FONT_SIGNALS)) {
        const $value = FONT_SIGNALS[type],
          defaultValue = FONT_DEFAULTS[type],
          storageKey = `vds-player:${camelToKebabCase(type)}`;

        effect(() => {
          const value = $value(),
            isDefaultVarValue = value === defaultValue;

          for (const player of players) {
            setFontCssVar(player, type, value);
          }

          if (isDefaultVarValue) {
            localStorage.removeItem(storageKey);
          } else {
            localStorage.setItem(storageKey, value);
          }
        });
      }
    }, null);

    isWatchingVars = true;
  }
}

function applyFontCssVars(player: MediaPlayer) {
  for (const type of keysOf(FONT_SIGNALS)) {
    setFontCssVar(player, type, FONT_SIGNALS[type]());
  }
}

function setFontCssVar(player: MediaPlayer, type: FontSignal, value: string) {
  const defaultValue = FONT_DEFAULTS[type],
    varName = `--media-user-${camelToKebabCase(type)}`,
    varValue = value !== defaultValue ? getCssVarValue(type, value) : null;

  if (type === 'fontFamily') {
    const fontVariant = value === 'capitals' ? 'small-caps' : null;
    player.el?.style.setProperty('--media-user-font-variant', fontVariant);
  }

  player.el?.style.setProperty(varName, varValue);
}

function getCssVarValue(type: FontSignal, value: string) {
  switch (type) {
    case 'fontFamily':
      return getFontFamilyCSSVarValue(value);
    case 'fontSize':
    case 'textOpacity':
    case 'textBgOpacity':
    case 'displayBgOpacity':
      return percentToRatio(value);
    case 'textColor':
      return `rgb(${hexToRgb(value)} / var(--media-user-text-opacity, 1))`;
    case 'textShadow':
      return getTextShadowCssVarValue(value);
    case 'textBg':
      return `rgb(${hexToRgb(value)} / var(--media-user-text-bg-opacity, 1))`;
    case 'displayBg':
      return `rgb(${hexToRgb(value)} / var(--media-user-display-bg-opacity, 1))`;
  }
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
