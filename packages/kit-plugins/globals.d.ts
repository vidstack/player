declare module '*?highlight' {
  const tokens: string;
  const code: string;
  /** Highlighted code. */
  const hlCode: string;
  export { tokens, code, hlCode };
}

declare module '*.md' {
  import { SvelteComponent } from 'svelte';

  const __slug: string;

  export { __slug };
  export default SvelteComponent;
}
