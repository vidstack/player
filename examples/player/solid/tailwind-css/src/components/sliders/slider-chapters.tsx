export function SliderChapters() {
  return (
    <media-slider-chapters class="relative flex h-full w-full items-center rounded-[1px]">
      <template>
        <SliderChapter />
      </template>
    </media-slider-chapters>
  );
}

function SliderChapter() {
  return (
    <div
      class="last-child:mr-0 relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
      style="contain: layout style;"
    >
      {/* Track */}
      <div class="track ring-media-focus absolute left-0 top-1/2 z-0 h-[5px] w-full -translate-y-1/2 rounded-sm bg-white/30 group-data-[focus]:ring-[3px]" />
      {/* Track fill */}
      <div
        class="bg-media-brand absolute left-0 top-1/2 z-10 h-[5px] w-[var(--chapter-fill)] -translate-y-1/2 rounded-sm will-change-[width]"
        style="will-change: width"
      />
      {/* Progress */}
      <div class="absolute left-0 top-1/2 z-10 h-[5px] w-[var(--chapter-progress)] -translate-y-1/2 rounded-sm bg-white/50 will-change-[width]" />
    </div>
  );
}
