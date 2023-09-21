<script lang="ts">
  import SubmenuButton from './SubmenuButton.svelte';

  export let label: string;
</script>

<media-menu class="vds-menu">
  <SubmenuButton {label}>
    <slot name="icon" slot="icon" />
  </SubmenuButton>
  <media-menu-items class="vds-menu-items">
    <slot name="content" />
  </media-menu-items>
</media-menu>
