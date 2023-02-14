/// <reference types="vite/client" />
/// <reference types="vidstack/globals" />
/// <reference types="@vessel-js/app/globals" />
/// <reference types="@vessel-js/svelte/globals" />
/// <reference types="unplugin-icons/types/svelte" />

declare module '*?highlight' {
  export interface CodeHighlight {
    lang: string;
    code: string;
    highlightedCode: string
  };

  const highlight: CodeHighlight;
  export default highlight;
}

declare module '*?highlight-lazy' {
  export interface LazyCodeHighlight {
    lines: number;
    scrollX: number;
    loader: () => Promise<{default: {
      lang: string;
      code: string;
      highlightedCode: string
    }}>;
  };

  const highlight: LazyCodeHighlight;
  export default highlight;
}

declare module ':virtual/code_snippets' {
  export interface CodeSnippet {
    name: string;
    lines: number;
    scrollX: number;
    path: string;
    loader: () => Promise<{default: {
      lang: string;
      code: string;
      highlightedCode: string
    }}>;
  };

  const snippets: CodeSnippet[];
  export default snippets;
}

declare module ':virtual/code_previews' {
  export interface CodePreview {
    name: string;
    path: string;
    loader: () => Promise<{ default: typeof import('svelte').SvelteComponent }>;
  };

  const previews: CodePreview[];
  export default previews;
}
