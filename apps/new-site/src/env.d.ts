/// <reference types="astro/client" />

declare module '~icons/*' {
  import { SvelteComponent } from 'svelte';
  export default class Icon extends SvelteComponent<svelteHTML.IntrinsicElements['svg']> {}
}

declare module '~astro-icons/*' {
  import type { HTMLAttributes } from 'astro/types';
  const svg: HTMLAttributes['svg'];
  export default svg;
}

declare module '*?highlight' {
  import type { CodeSnippet } from ':code_snippets';
  const highlight: CodeSnippet;
  export default highlight;
}

declare module ':code_snippets' {
  export interface LazyCodeSnippet {
    id: string;
    width: number;
    lines: number;
    highlights?: string;
    framework?: 'html' | 'react';
    loader: () => Promise<CodeSnippetModule>;
  }

  export interface CodeSnippetModule {
    default: CodeSnippet;
  }

  export interface CodeSnippet {
    source: string;
    code: {
      lang: string;
      light: () => Promise<CodeHighlightModule>;
      dark: () => Promise<CodeHighlightModule>;
    };
  }

  export interface CodeHighlightModule {
    default: string;
  }

  const snippets: LazyCodeSnippet[];
  export default snippets;
}
