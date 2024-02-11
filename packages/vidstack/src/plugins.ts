import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createFilter } from 'rollup-pluginutils';
import { createUnplugin } from 'unplugin';
import type { ViteDevServer } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const defaultIncludePattern = /\.(jsx|tsx|html|vue|svelte)/,
  bundleModuleId = 'vidstack/bundle',
  mediaElementPrefix = 'media-',
  defaultThemeClassPrefix = 'vds-',
  elementsFilePath = path.resolve(__dirname, './elements.json'),
  elementsJSON = fs.readFileSync(elementsFilePath, 'utf8'),
  elementsManifest = JSON.parse(elementsJSON) as Record<string, string>;

// These elements need to be registered before their children to prevent async setup flows.
const priorityImports = [
  // Core
  'media-player',
  'media-provider',
  // Layout
  'media-audio-layout',
  'media-video-layout',
  'media-plyr-layout',
  'media-layout',
  'media-controls',
  'media-controls-group',
  'media-poster',
  // Tooltips
  'media-tooltip',
  'media-tooltip-trigger',
  'media-tooltip-content',
  // Sliders
  'media-slider',
  'media-volume-slider',
  'media-time-slider',
  // Menus
  'media-menu',
  'media-menu-button',
  'media-menu-portal',
  'media-menu-items',
];

const defaultStyles = {
  'vds-buffering-indicator': 'buffering.css',
  'vds-button': 'buttons.css',
  'vds-captions': 'captions.css',
  'vds-chapter-title': 'chapter-title.css',
  'vds-controls': 'controls.css',
  'vds-gesture': 'gestures.css',
  'vds-icon': 'icons.css',
  'vds-kb-action': 'keyboard.css',
  'vds-menu': 'menus.css',
  'vds-poster': 'poster.css',
  'vds-slider': 'sliders.css',
  'vds-thumbnail': 'thumbnail.css',
  'vds-time': 'time.css',
  'vds-tooltip': 'tooltips.css',
  audio: 'layouts/audio.css',
  video: 'layouts/video.css',
};

for (const name of Object.keys(defaultStyles)) {
  defaultStyles[name] = `vidstack/player/styles/default/${defaultStyles[name]}`;
}

type ElementsGraph = Map<string, Set<string>>;
type StylesGraph = Map<string, Set<string>>;

export type FilterPattern = Array<string | RegExp> | string | RegExp | null;

export interface UserOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export const unplugin = createUnplugin<UserOptions | undefined>((options = {}) => {
  let include = options.include ?? defaultIncludePattern,
    filter = createFilter(include, options.exclude),
    // Elements and styles across all modules.
    elements = new Set<string>(),
    styles = new Set<string>(),
    // Module-specific elements and styles (tracked for HMR).
    elementsGraph: ElementsGraph = new Map(),
    stylesGraph: StylesGraph = new Map(),
    viteServer: ViteDevServer | null = null;

  function invalidateBundleModule() {
    elements.clear();
    for (const tagNames of elementsGraph.values()) {
      for (const tagName of tagNames) elements.add(tagName);
    }

    styles.clear();
    for (const files of stylesGraph.values()) {
      for (const file of files) styles.add(file);
    }

    const mod = viteServer?.moduleGraph.getModuleById(bundleModuleId);
    mod && viteServer?.moduleGraph.invalidateModule(mod);
    viteServer?.ws.send({ type: 'full-reload' });
  }

  function parse(id: string, code: string) {
    if (viteServer) {
      const oldElements = elementsGraph.get(id),
        oldStyles = stylesGraph.get(id),
        newElements = new Set<string>(),
        newStyles = new Set<string>();

      parseCode(code, newElements, newStyles);

      const isEqual = isSetsEqual(oldElements, newElements) && isSetsEqual(oldStyles, newStyles);

      if (!isEqual) {
        elementsGraph.set(id, newElements);
        stylesGraph.set(id, newStyles);
        invalidateBundleModule();
      }
    } else {
      parseCode(code, elements, styles);
    }
  }

  return {
    name: 'vidstack',
    enforce: 'pre',
    resolveId(id) {
      if (id === bundleModuleId) return id;
    },
    load(id) {
      if (id === bundleModuleId) {
        const imports: string[] = [],
          hasDefaultLayout =
            elements.has('media-audio-layout') || elements.has('media-video-layout'),
          hasPlyrLayout = elements.has('media-plyr-layout');

        if (!hasDefaultLayout) {
          imports.push('import "vidstack/player/styles/base.css";');

          for (const style of styles) {
            imports.push(`import "${style}";`);
          }

          const elementClasses = new Set<string>();

          for (const tagName of [...priorityImports, ...elements]) {
            if (!elements.has(tagName)) continue;

            if (tagName === 'media-plyr-layout') {
              imports.push('vidstack/player/styles/plyr/theme.css');
              imports.push('vidstack/player/layouts/plyr');
              continue;
            }

            const className = elementsManifest[tagName];

            if (className) {
              elementClasses.add(className);
            } else {
              console.warn(`[vidstack]: unknown media element was found \`${tagName}\``);
            }
          }

          const elementImports = ['defineCustomElement', ...elementClasses];
          imports.push(`import {\n${elementImports.join(',\n')}\n} from "vidstack/elements";`);

          return (
            imports.join('\n') +
            '\n\n' +
            [...elementClasses].map((name) => `defineCustomElement(${name});`).join('\n')
          );
        } else {
          imports.push(`import "vidstack/player/styles/default/theme.css";`);

          if (hasPlyrLayout) {
            imports.push(`vidstack/player/styles/plyr/theme.css`);
          }

          if (elements.has('media-audio-layout')) {
            imports.push(`import "vidstack/player/styles/default/layouts/audio.css";`);
          }

          if (elements.has('media-video-layout')) {
            imports.push(`import "vidstack/player/styles/default/layouts/video.css";`);
          }

          imports.push('import "vidstack/player";');
          imports.push(`import "vidstack/player/layouts${!hasPlyrLayout ? '/default' : ''}";`);
          imports.push('import "vidstack/player/ui";');

          return imports.join('\n');
        }
      }

      return null;
    },
    transformInclude(id) {
      return filter(id);
    },
    transform(code, id) {
      parse(id, code);
      return null;
    },
    vite: {
      configureServer(server) {
        viteServer = server;
      },
      async handleHotUpdate({ file, read }) {
        if (!filter(file)) return;
        parse(file, await read());
      },
    },
  };
});

const PARSE_MODE_NONE = 0,
  PARSE_MODE_ELEMENT = 1,
  PARSE_MODE_STYLE = 2;

function parseCode(code: string, elements: Set<string>, styles: Set<string>) {
  let mode = PARSE_MODE_NONE,
    char = '',
    buffer = '';

  for (let i = 0; i < code.length; i++) {
    char = code[i];
    switch (mode) {
      case PARSE_MODE_NONE:
        if (char === '<' && code[i + 1] !== '/') {
          buffer = '';
          mode = PARSE_MODE_ELEMENT;
        } else if (
          char === 'v' &&
          code[i + 1] === 'd' &&
          code[i + 2] === 's' &&
          code[i + 3] === '-'
        ) {
          buffer = 'v';
          mode = PARSE_MODE_STYLE;
        }
        break;
      case PARSE_MODE_ELEMENT:
        if (char === ' ' || char === '>' || char === '\n' || char === '\r') {
          if (buffer.startsWith(mediaElementPrefix)) elements.add(buffer);
          buffer = '';
          mode = PARSE_MODE_NONE;
        } else {
          buffer += char;
        }
        break;
      case PARSE_MODE_STYLE:
        if (buffer.startsWith(defaultThemeClassPrefix)) {
          buffer += char;
          if (buffer in defaultStyles) {
            styles.add(defaultStyles[buffer]);
            buffer = '';
            mode = PARSE_MODE_NONE;
          }
        } else if (
          char === ' ' ||
          char === '\n' ||
          char === '\r' ||
          buffer.length > defaultThemeClassPrefix.length
        ) {
          mode = PARSE_MODE_NONE;
        } else {
          buffer += char;
        }
        break;
    }
  }
}

function isSetsEqual(a?: Set<any>, b?: Set<any>): boolean {
  return (
    (!a?.size && !b?.size) ||
    (!!a && !!b && a.size === b.size && [...a].every((value) => b.has(value)))
  );
}

export const vite = (options?: UserOptions) => unplugin.vite(options);
export const rollup = (options?: UserOptions) => unplugin.rollup(options);
export const webpack = (options?: UserOptions) => unplugin.webpack(options);
export const rspack = (options?: UserOptions) => unplugin.rspack(options);
export const esbuild = (options?: UserOptions) => unplugin.esbuild(options);
