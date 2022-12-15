import { registerCustomElement } from 'maverick.js/element';
import { uppercaseFirstChar } from 'maverick.js/std';

export type VidstackElement =
  | 'vds-aspect-ratio'
  | 'vds-audio'
  | 'vds-gesture'
  | 'vds-hls-video'
  | 'vds-media-sync'
  | 'vds-media-visibility'
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
  | 'vds-slider'
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

// TODO: add all element loaders and remove expect error below.
// @ts-expect-error - we haven't defined all elements yet.
const ELEMENT_DEFINITION_LOADER: Record<VidstackElement, () => Promise<any>> = {
  // 'vds-aspect-ratio': () => import(''),
  // 'vds-fullscreen-button': () => import(''),
  // 'vds-media-sync': () => import(''),
  // 'vds-media-visibility': () => import(''),
  // 'vds-mute-button': () => import(''),
  'vds-play-button': () => import('./player/ui/play-button/play-button-element'),
  // 'vds-slider-value-text': () => import(''),
  // 'vds-slider-video': () => import(''),
  // 'vds-time-slider': () => import(''),
  // 'vds-volume-slider': () => import(''),
  'vds-audio': () => import('./player/providers/audio/audio-element'),
  // 'vds-gesture': () => import(''),
  'vds-hls-video': () => import('./player/providers/hls/hls-video-element'),
  'vds-media': () => import('./player/media/element/media-element'),
  // 'vds-poster': () => import(''),
  // 'vds-slider': () => import(''),
  // 'vds-time': () => import(''),
  'vds-video': () => import('./player/providers/video/video-element'),
};

async function loadCustomElement(tagName: VidstackElement) {
  const name = tagName.replace('vds-', ''),
    specifier = uppercaseFirstChar(name).replace(/^hls/, 'HLS') + 'ElementDefinition',
    definition = (await ELEMENT_DEFINITION_LOADER[tagName]())[specifier];
  registerCustomElement(definition);
}

async function loadAllCustomElements() {
  const definitions = (await import('./elements-all')).default;
  return definitions.map(registerCustomElement);
}
