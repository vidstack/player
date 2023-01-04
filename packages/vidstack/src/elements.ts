import { CustomElementDefinition, registerLiteCustomElement } from 'maverick.js/element';

export type VidstackElement =
  | 'vds-aspect-ratio'
  | 'vds-audio'
  | 'vds-hls-video'
  | 'vds-media'
  | 'vds-poster'
  | 'vds-video'
  | VidstackUIElement;

export type VidstackUIElement =
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
    define: (tagName: VidstackElement) => Promise<void>;
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

export interface CustomElementModuleLoader {
  (): Promise<{
    default: CustomElementDefinition;
  }>;
}

// TODO: add all element loaders and remove expect error below.
// @ts-expect-error - we haven't defined all elements yet.
const ELEMENT_DEFINITION_LOADER: Record<VidstackElement, CustomElementModuleLoader> = {
  'vds-aspect-ratio': () => import('./player/ui/aspect-ratio/element'),
  'vds-fullscreen-button': () => import('./player/ui/fullscreen-button/element'),
  'vds-mute-button': () => import('./player/ui/mute-button/element'),
  'vds-play-button': () => import('./player/ui/play-button/element'),
  'vds-slider-value-text': () => import('./player/ui/slider-value-text/element'),
  // 'vds-slider-video': () => import(''),
  'vds-time-slider': () => import('./player/ui/time-slider/element'),
  'vds-volume-slider': () => import('./player/ui/volume-slider/element'),
  'vds-audio': () => import('./player/providers/audio/element'),
  'vds-hls-video': () => import('./player/providers/hls/element'),
  'vds-media': () => import('./player/media/element/element'),
  'vds-poster': () => import('./player/ui/poster/element'),
  'vds-time': () => import('./player/ui/time/element'),
  'vds-video': () => import('./player/providers/video/element'),
};

async function loadCustomElement(tagName: VidstackElement) {
  const mod = await ELEMENT_DEFINITION_LOADER[tagName]();
  registerLiteCustomElement(mod.default);
}

async function loadAllCustomElements() {
  const definitions = (await import('./elements-all')).default;
  return definitions.map(registerLiteCustomElement);
}
