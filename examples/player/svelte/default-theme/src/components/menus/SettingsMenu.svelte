<script lang="ts">
  import type { MenuPlacement, TooltipPlacement } from 'vidstack';

  import CaptionSubmenu from '../menus/CaptionSubmenu.svelte';
  import Menu from '../menus/Menu.svelte';

  export let placement: MenuPlacement;
  export let tooltipPlacement: TooltipPlacement;
</script>

<Menu {placement} {tooltipPlacement}>
  <media-icon class="vds-rotate-icon" type="settings" slot="button" />

  <CaptionSubmenu slot="content" />

  <span slot="tooltip-content">Settings</span>
</Menu>
