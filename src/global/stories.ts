declare module '*.svelte' {
  const component: typeof import('svelte').SvelteComponent;
  export default component;
}
