<script>
  import clsx from 'clsx';
  import { SliderValueText, TimeSlider } from '@vidstack/player-svelte';
  import { createEventDispatcher } from 'svelte';

  let previewImg;

  export let playbackId;

  const dispatch = createEventDispatcher();
</script>

<TimeSlider
  class="media-slider media-time-slider pointer-events-auto relative flex h-[48px] w-full translate-y-4 transform cursor-pointer items-center"
  on:vds-slider-pointer-value-change={(e) => {
    dispatch('preview-time-update', e.detail);
  }}
  on:vds-slider-drag-end={() => {
    dispatch('drag-end');
  }}
>
  <div class="media-slider-track" />
  <div class="media-slider-track fill" />
  <div class="media-slider-thumb-container">
    <div class="media-slider-thumb" />
  </div>
  <!-- Media Preview Container -->
  <div
    class={clsx(
      'media-preview-container absolute flex transform flex-col items-center opacity-0',
      'pointer-events-none -translate-x-1/2 rounded-sm transition-opacity duration-200 ease-out',
    )}
  >
    <!-- Media Preview -->
    <div
      class={clsx(
        'block scale-125 transform overflow-hidden rounded-sm bg-[#161616]',
        'h-[var(--media-preview-height)] w-[var(--media-preview-width)]',
      )}
      style="aspect-ratio: 16 / 9;"
    >
      <!-- Media Preview Storyboard -->
      <img
        class="block max-w-none"
        alt=""
        crossorigin="anonymous"
        loading="eager"
        decoding="async"
        src={`https://image.mux.com/${playbackId}/storyboard.jpg`}
        aria-hidden="true"
        on:load={() => {
          dispatch('storyboard-load', previewImg);
        }}
        bind:this={previewImg}
      />
    </div>
    <SliderValueText
      class="media-time mt-5 rounded-sm bg-[#161616] px-1.5 py-[2px] text-xs"
      type="pointer"
      format="time"
      style="letter-spacing: 1px;"
    />
  </div>
</TimeSlider>
