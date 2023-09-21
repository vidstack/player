<script lang="ts">
  import SubmenuButton from './SubmenuButton.svelte';

  export let label: string;
</script>

<media-menu>
  <SubmenuButton {label}>
    <slot name="icon" slot="icon" />
  </SubmenuButton>
  <media-menu-items class="content">
    <slot name="content" />
  </media-menu-items>
</media-menu>

<style lang="postcss">
  .content {
    display: inline-block;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin-top: 12px;

    &[aria-hidden='true'] {
      display: none;
    }
  }
</style>
