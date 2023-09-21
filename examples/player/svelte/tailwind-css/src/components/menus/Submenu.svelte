<script lang="ts">
  import SubmenuButton from './SubmenuButton.svelte';

  export let label: string;
</script>

<media-menu>
  <SubmenuButton {label}>
    <slot name="icon" slot="icon" />
  </SubmenuButton>
  <media-menu-items
    class="hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block"
  >
    <slot name="content" />
  </media-menu-items>
</media-menu>
