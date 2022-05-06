<script>
  let hideMessage = false;
  setTimeout(() => {
    hideMessage = true;
  }, 5000);
</script>

<div class="flex w-full flex-col">
  <div class="mx-auto mt-2 flex w-full max-w-[95%] items-center justify-center">
    <slot />

    {#if !hideMessage}
      <p class="pointer-events-none absolute">tap to start playback</p>
    {/if}
  </div>

  <p class="mt-4 px-2 text-xs text-black dark:text-white">The following gestures are applied:</p>

  <ul class="my-4 space-y-2 px-2 text-xs">
    <li>- Toggle playback when the user taps the player.</li>
    <li>- Toggle fullscreen when the user double taps the player.</li>
    <li>- Pause media when the user's mouse leaves the player.</li>
    <li>
      - Seek playback backwards thirty seconds when the user double-taps on the left region (25%) of
      the player.
    </li>
    <li>
      - Seek playback forwards thirty seconds when the user double-taps on the right region (25%) of
      the player.
    </li>
  </ul>
</div>
