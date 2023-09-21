<script lang="ts">
  import MenuRadio from './MenuRadio.svelte';
  import Submenu from './Submenu.svelte';
</script>

<Submenu label="Captions">
  <media-icon class="icon" type="closed-captions" slot="icon" />
  <media-captions-radio-group class="radio-group" slot="content">
    <template>
      <MenuRadio />
    </template>
  </media-captions-radio-group>
</Submenu>

<style>
  .icon {
    width: 22px;
    height: 22px;
  }

  .radio-group {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
