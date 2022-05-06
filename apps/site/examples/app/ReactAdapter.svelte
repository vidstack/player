<script>
  import { createRoot } from 'react-dom/client';
  import { onMount, onDestroy } from 'svelte';

  let root;
  let container;

  export let component;

  function mount(component) {
    root.render(component?.({}));
  }

  $: if (root) mount(component);

  onMount(() => {
    root = createRoot(container);
  });

  onDestroy(() => {
    root.unmount();
  });
</script>

<div class="contents" bind:this={container} />
