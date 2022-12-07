import { registerCustomElement } from 'maverick.js/element';

export type VidstackElement =
  | 'vds-aspect-ratio'
  | 'vds-audio'
  | 'vds-gesture'
  | 'vds-hls'
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

const ELEMENT_DEFINITION_LOADER = {
  // 'aspect-ratio': () => import(''),
  // 'fullscreen-button': () => import(''),
  // 'media-sync': () => import(''),
  // 'media-visibility': () => import(''),
  // 'mute-button': () => import(''),
  // 'play-button': () => import(''),
  // 'slider-value-text': () => import(''),
  // 'slider-video': () => import(''),
  // 'time-slider': () => import(''),
  // 'volume-slider': () => import(''),
  // audio: () => import(''),
  // gesture: () => import(''),
  // hls: () => import(''),
  media: () => import('./player/media/media-element'),
  // poster: () => import(''),
  // slider: () => import(''),
  // time: () => import(''),
  // video: () => import(''),
};

async function loadCustomElement(tagName: VidstackElement) {
  const definition = await ELEMENT_DEFINITION_LOADER[tagName]();
  registerCustomElement(definition);
}

async function loadAllCustomElements() {
  const definitions = (await import('./elements-all')).default;
  return Promise.all(definitions.map(registerCustomElement));
}
