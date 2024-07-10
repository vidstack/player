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

interface GraphData {
  // Module-specific elements and styles (tracked for HMR).
  elementsGraph: ElementsGraph;
  stylesGraph: StylesGraph;
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
    data: GraphData = {
      elementsGraph: new Map(),
      stylesGraph: new Map(),
    },
    defaultAudioLayout = false,
    defaultVideoLayout = false,
    plyrLayout = false,
    chunkToFile = new Map<string, string>(),
    moduleToChunk = new Map<string, string>(),
    invalidated = new Set<string>(),
    viteServer: ViteDevServer | null = null;

  function hasDefaultLayout() {
    return defaultAudioLayout || defaultVideoLayout;
  }

  function processModule(id: string, code: string) {
    const { elementsGraph, stylesGraph } = data,
      { elements, styles } = parse(code);

    if (elements.size) {
      if (elements.has('media-audio-layout')) defaultAudioLayout = true;
      if (elements.has('media-video-layout')) defaultVideoLayout = true;
      if (elements.has('media-plyr-layout')) plyrLayout = true;
      elementsGraph.set(id, elements);
    }

    if (styles.size) {
      stylesGraph.set(id, styles);
    }

    return { elements, styles };
  }

  function invalidateAll() {
    if (!viteServer) return;

    invalidateModule(bundleModuleId);

    for (const id of chunkToFile.keys()) invalidateModule(id);
  }

  function invalidateModule(id: string) {
    const mod = viteServer?.moduleGraph.getModuleById(id);
    if (mod) viteServer?.moduleGraph.invalidateModule(mod);
  }

  function reload() {
    viteServer?.hot.send({ type: 'full-reload' });
  }

  return [
    {
      name: 'vidstack-pre',
      enforce: 'pre',
      resolveId(id) {
        if (id === bundleModuleId) return id;
        else if (chunkToFile.has(id)) return id;
      },
      load(id) {
        if (id === bundleModuleId) {
          return generateBundleImports({
            defaultAudioLayout,
            defaultVideoLayout,
            plyrLayout,
          });
        }

        if (chunkToFile.has(id)) {
          if (hasDefaultLayout()) return '';

          const moduleId = chunkToFile.get(id),
            elements = data.elementsGraph.get(moduleId!),
            styles = data.stylesGraph.get(moduleId!);

          return elements || styles ? generateElementImports(elements, styles) : '';
        }

        return null;
      },
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        processModule(id, code);
        return null;
      },
      vite: {
        configureServer(server) {
          viteServer = server;
        },
        async handleHotUpdate({ file, read }) {
          if (!filter(file)) return;

          const oldElements = data.elementsGraph.get(file),
            oldStyles = data.stylesGraph.get(file);

          const { elements: newElements, styles: newStyles } = processModule(file, await read());

          const hasChangedLayouts =
            diff(oldElements, newElements, 'media-audio-layout') ||
            diff(oldElements, newElements, 'media-video-layout') ||
            diff(oldElements, newElements, 'media-plyr-layout');

          data.elementsGraph.set(file, newElements);
          data.stylesGraph.set(file, newStyles);

          if (hasChangedLayouts) {
            defaultAudioLayout = false;
            defaultVideoLayout = false;
            plyrLayout = false;

            invalidateAll();
            reload();

            return;
          }

          const isEqual =
            isSetsEqual(oldElements, newElements) && isSetsEqual(oldStyles, newStyles);

          if (!isEqual) {
            const chunkId = moduleToChunk.get(file);
            if (chunkId) {
              invalidateModule(chunkId);
              reload();
            }
          }
        },
      },
    },
    {
      name: 'vidstack-post',
      enforce: 'post',
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        const { elementsGraph, stylesGraph } = data,
          elements = elementsGraph.get(id),
          styles = stylesGraph.get(id);

        if (elements?.size || styles?.size) {
          let chunkId = moduleToChunk.get(id)!;

          if (!chunkId) {
            chunkId = `:vidstack/chunk-${chunkToFile.size}`;
            chunkToFile.set(chunkId, id);
            moduleToChunk.set(id, chunkId);
          }

          return code.startsWith(`import "${chunkId}";`) ? code : `import "${chunkId}";\n` + code;
        }

        return null;
      },
    },
  ];
});

const PARSE_MODE_NONE = 0,
  PARSE_MODE_ELEMENT = 1,
  PARSE_MODE_STYLE = 2;

function parse(code: string) {
  let mode = PARSE_MODE_NONE,
    char = '',
    buffer = '',
    elements = new Set<string>(),
    styles = new Set<string>();

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

  elements.delete('media-player');
  elements.delete('media-provider');

  return { elements, styles };
}

function generateBundleImports({
  defaultAudioLayout = false,
  defaultVideoLayout = false,
  plyrLayout = false,
}) {
  const styles: string[] = [],
    imports: string[] = [],
    hasDefaultLayout = defaultAudioLayout || defaultVideoLayout;

  if (!hasDefaultLayout) {
    styles.push('import "vidstack/player/styles/base.css";');
    if (plyrLayout) {
      styles.push('import "vidstack/player/styles/plyr/theme.css";');
      imports.push('import "vidstack/player/layouts/plyr";');
    }
  } else {
    styles.push(`import "vidstack/player/styles/default/theme.css";`);

    if (plyrLayout) {
      styles.push(`import "vidstack/player/styles/plyr/theme.css";`);
    }

    if (defaultAudioLayout) {
      styles.push(`import "vidstack/player/styles/default/layouts/audio.css";`);
    }

    if (defaultVideoLayout) {
      styles.push(`import "vidstack/player/styles/default/layouts/video.css";`);
    }

    imports.push(`import "vidstack/player/layouts${!plyrLayout ? '/default' : ''}";`);
    imports.push('import "vidstack/player/ui";');
  }

  return [...styles, 'import "vidstack/player";', ...imports].join('\n');
}

function generateElementImports(
  elements: Set<string> = new Set(),
  styles: Set<string> = new Set(),
) {
  const imports: string[] = [],
    elementClasses = new Set<string>();

  for (const style of styles) imports.push(`import "${style}";`);

  for (const tagName of elements) {
    if (!elements.has(tagName)) continue;

    const className = elementsManifest[tagName];

    if (className) {
      elementClasses.add(className);
    } else if (className !== 'media-icon') {
      console.warn(`[vidstack]: unknown media element was found \`${tagName}\``);
    }
  }

  if (elementClasses.size === 0) return imports.join('\n');

  const elementImports = ['defineCustomElement', ...elementClasses];
  imports.push(`import {\n${elementImports.join(',\n')}\n} from "vidstack/elements";`);

  const definitions = [...elementClasses].map((name) => `defineCustomElement(${name});`);

  return imports.join('\n') + '\n\n' + definitions.join('\n');
}

function diff(a: Set<any> | undefined, b: Set<any> | undefined, key: string) {
  return !!a && !!b && a.has(key) && b.has(key);
}

function isSetsEqual(a: Set<any> | undefined, b: Set<any> | undefined): boolean {
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
