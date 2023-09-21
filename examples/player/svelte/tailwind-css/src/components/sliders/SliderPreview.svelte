<script lang="ts">
  export let thumbnails: string | undefined = undefined;
  export let noClamp: boolean | undefined = undefined;
</script>

<media-slider-preview
  class="flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100"
  {noClamp}
>
  {#if thumbnails}
    <media-slider-thumbnail
      class="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
      src={thumbnails}
    />
  {/if}

  <slot />
</media-slider-preview>
