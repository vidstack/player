<script lang="ts">
  import CaptionSubmenu from '../menus/CaptionSubmenu.svelte';
  import Menu from '../menus/Menu.svelte';
</script>

<Menu placement="top end" tooltipPlacement="top end">
  <media-icon class="rotate-icon" type="settings" slot="button" />
  <CaptionSubmenu slot="content" />
  <span slot="tooltip-content">Settings</span>
</Menu>

<style>
  .rotate-icon {
    transition: transform 0.2s ease-out;
  }

  :global(.media-button[aria-expanded='true']) .rotate-icon {
    transform: rotate(90deg);
    transition: transform 0.2s ease-in;
  }
</style>
