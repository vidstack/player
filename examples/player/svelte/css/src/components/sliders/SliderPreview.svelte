<script lang="ts">
  export let thumbnails: string | undefined = undefined;
  export let noClamp: boolean | undefined = undefined;
</script>

<media-slider-preview class="preview" {noClamp}>
  {#if thumbnails}
    <media-slider-thumbnail class="thumbnail" src={thumbnails} />
  {/if}

  <slot />
</media-slider-preview>

<style lang="postcss">
  .preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    border-radius: 2px;
    pointer-events: none;
    transition: opacity 0.2s ease-out;
    will-change: left, opacity;
    contain: layout paint style;

    &[data-visible] {
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }
  }

  .thumbnail {
    display: block;
    width: var(--thumbnail-width);
    height: var(--thumbnail-height);
    background-color: black;
    border: 1px solid white;
    contain: strict;
    overflow: hidden;
    min-width: 120px;
    min-height: 80px;
    max-width: 180px;
    max-height: 160px;
  }
</style>
