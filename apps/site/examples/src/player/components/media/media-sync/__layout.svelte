<script>
  const path = location.pathname;
</script>

<div class="flex flex-col p-2">
  <div class="media flex flex-col items-center">
    <slot />
  </div>

  <p class="mt-4 text-center text-xs">
    {#if path.includes('single-playback')}
      Press play on any video and then trying playing the other one.
    {:else if path.includes('sync-volume')}
      Change the volume of one of the players and observe the volume on the other. Try muting them
      as well. Finally, open your console to see the <code>vds-media-volume-sync</code> event fire as
      you make any volume changes.
    {/if}
  </p>
</div>

<style>
  .media :global(vds-media) {
    max-width: 325px;
  }
</style>
