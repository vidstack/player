<script lang="ts">
  import MenuRadio from './MenuRadio.svelte';
  import Submenu from './Submenu.svelte';
</script>

<Submenu label="Captions">
  <media-icon class="h-5 w-5" type="closed-captions" slot="icon" />
  <media-captions-radio-group class="w-full flex flex-col" slot="content">
    <template>
      <MenuRadio />
    </template>
  </media-captions-radio-group>
</Submenu>
