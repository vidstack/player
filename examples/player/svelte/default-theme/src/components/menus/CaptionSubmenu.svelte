<script lang="ts">
  import Submenu from './Submenu.svelte';
</script>

<Submenu label="Captions">
  <media-icon class="vds-menu-button-icon" type="closed-captions" slot="icon" />

  <media-captions-radio-group class="vds-captions-radio-group vds-radio-group" slot="content">
    <template>
      <media-radio class="vds-radio">
        <div class="vds-radio-check"></div>
        <span class="vds-radio-label" data-part="label"></span>
      </media-radio>
    </template>
  </media-captions-radio-group>
</Submenu>
