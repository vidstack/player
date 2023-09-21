<script lang="ts">
  import CaptionSubmenu from '../menus/CaptionSubmenu.svelte';
  import Menu from '../menus/Menu.svelte';
</script>

<Menu placement="top end" tooltipPlacement="top end">
  <media-icon class="vds-rotate-icon" type="settings" slot="button" />

  <CaptionSubmenu slot="content" />

  <span slot="tooltip-content">Settings</span>
</Menu>
