<script>
  const path = location.pathname;
</script>

{#if path.includes('viewport-visibility')}
  <div class="flex w-full flex-col items-center">
    <div class="mt-4 flex px-2">
      <p class="text-center text-sm">Scrolling down away from player will pause playback</p>

      <svg
        class="ml-1 mt-0.5 animate-bounce text-black dark:text-white"
        aria-hidden="true"
        role="img"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m13 16.172l5.364-5.364l1.414 1.414L12 20l-7.778-7.778l1.414-1.414L11 16.172V4h2v12.172z"
        />
      </svg>
    </div>

    <div class="mt-8 mb-[50vh] max-w-[95%]">
      <slot />
    </div>

    <div class="mt-8 mb-4 flex px-2">
      <p class="text-center text-sm">Scrolling up to player will resume playback</p>

      <svg
        class="ml-1 mt-0.5 animate-bounce text-black dark:text-white"
        aria-hidden="true"
        role="img"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M13 7.828V20h-2V7.828l-5.364 5.364l-1.414-1.414L12 4l7.778 7.778l-1.414 1.414L13 7.828z"
        />
      </svg>
    </div>
  </div>
{:else if path.includes('page-visibility')}
  <div class="flex flex-col w-full items-center">
    <div class="max-w-[95%]">
      <slot />
    </div>

    <p class="text-sm mt-4 text-center px-2">
      Unmute the video and try going to another tab, minimizing the window or alt-tabbing to another
      application. Observe the sound stops as media playback is paused.
    </p>
  </div>
{/if}
