<script lang="ts">
  import MenuRadio from './MenuRadio.svelte';
  import Submenu from './Submenu.svelte';
</script>

<Submenu label="Captions">
  <media-icon class="vds-menu-button-icon" type="closed-captions" slot="icon" />

  <media-captions-radio-group class="vds-captions-radio-group vds-radio-group" slot="content">
    <template>
      <MenuRadio />
    </template>
  </media-captions-radio-group>
</Submenu>
