<script lang="ts">
  import CaptionSubmenu from '../menus/CaptionSubmenu.svelte';
  import Menu from '../menus/Menu.svelte';
</script>

<Menu placement="top end" tooltipPlacement="top end">
  <media-icon
    class="h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90"
    type="settings"
    slot="button"
  />
  <CaptionSubmenu slot="content" />
  <span slot="tooltip-content">Settings</span>
</Menu>
