import type { CustomElementDefinition } from 'maverick.js/element';

export type VidstackElementTagName = VidstackProviderElementTagName | VidstackUIElementTagName;

export type VidstackProviderElementTagName = 'vds-audio' | 'vds-video' | 'vds-hls-video';

export type VidstackUIElementTagName =
  | 'vds-media'
  | 'vds-aspect-ratio'
  | 'vds-poster'
  | 'vds-fullscreen-button'
  | 'vds-mute-button'
  | 'vds-play-button'
  | 'vds-slider-value-text'
  | 'vds-slider-video'
  | 'vds-time-slider'
  | 'vds-time'
  | 'vds-volume-slider';

/**
 * Loads element definitions and registers them in the browser's custom elements registry.
 *
 * @example
 * ```ts
 * import { defineCustomElements } from "vidstack/elements";
 *
 * // 1. Load and define all elements:
 * await defineCustomElements();
 *
 * // 2. Or, load and define individually selected elements:
 * await defineCustomElements(async ({ define }) => {
 *   define('vds-media');
 *   define('vds-video');
 *   // Wait for a specific element to be defined.
 *   await define('vds-play-button');
 * });
 * ```
 */
export async function defineCustomElements(
  init?: (registry: {
    define: (tagName: VidstackElementTagName) => Promise<void>;
  }) => void | Promise<void>,
) {
  if (__SERVER__) return;

  const promises: Promise<void>[] = [];

  await init?.({
    define: async (tagName) => {
      const promise = loadCustomElement(tagName);
      promises.push(promise);
      return promise;
    },
  });

  return !promises.length ? loadAllCustomElements() : Promise.all(promises);
}

interface CustomElementModuleLoader {
  (): Promise<{
    default: CustomElementDefinition;
  }>;
}

const ELEMENT_DEFINITION_LOADER: Record<VidstackElementTagName, CustomElementModuleLoader> = {
  // Providers
  'vds-audio': () => import('./player/providers/audio/element.js'),
  'vds-video': () => import('./player/providers/video/element.js'),
  'vds-hls-video': () => import('./player/providers/hls/element.js'),
  // UI
  'vds-aspect-ratio': () => import('./player/ui/aspect-ratio/element.js'),
  'vds-fullscreen-button': () => import('./player/ui/fullscreen-button/element.js'),
  'vds-mute-button': () => import('./player/ui/mute-button/element.js'),
  'vds-play-button': () => import('./player/ui/play-button/element.js'),
  'vds-slider-value-text': () => import('./player/ui/slider-value-text/element.js'),
  'vds-slider-video': () => import('./player/ui/slider-video/element.js'),
  'vds-time-slider': () => import('./player/ui/time-slider/element.js'),
  'vds-volume-slider': () => import('./player/ui/volume-slider/element.js'),
  'vds-media': () => import('./player/media/element/element.js'),
  'vds-poster': () => import('./player/ui/poster/element.js'),
  'vds-time': () => import('./player/ui/time/element.js'),
};

async function loadCustomElement(tagName: VidstackElementTagName) {
  const { registerLiteCustomElement } = await import('maverick.js/element');
  const mod = await ELEMENT_DEFINITION_LOADER[tagName]();
  registerLiteCustomElement(mod.default);
}

async function loadAllCustomElements() {
  return (await import('./elements-all.js')).default();
}
