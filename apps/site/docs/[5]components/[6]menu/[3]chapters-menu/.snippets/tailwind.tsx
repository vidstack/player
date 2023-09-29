<MediaMenu class="relative inline-block">
  {/* Menu Button */}
  <MediaMenuButton
    className="group flex h-12 w-12 items-center justify-center rounded-sm outline-none"
    aria-label="Chapters"
  >
    <ChaptersIcon className="h-8 w-8 rounded-sm transition-transform duration-200 ease-out group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400" />
  </MediaMenuButton>
  {/* Menu Items */}
  <MediaChaptersMenuItems
    className="absolute right-0 bottom-full h-[var(--menu-height)] min-w-[260px] overflow-y-auto rounded-lg bg-black/95 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in aria-hidden:pointer-events-none aria-hidden:bottom-0 aria-hidden:opacity-0 data-[thumbnails]:min-w-[300px] data-[resizing]:overflow-hidden"
    containerClass="w-full"
    chapterClass="group flex cursor-pointer items-center p-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-2 data-[focus]:m-1 data-[focus]:ring-blue-400 border-b border-b-white/20 last:border-b-0 aria-checked:border-l-4 aria-checked:border-l-white"
    thumbnailClass="mr-3 min-w-[120px] min-h-[56px] max-w-[120px] max-h-[68px]"
    titleClass="text-white text-[15px] font-medium whitespace-nowrap"
    startTimeClass="inline-block py-px px-1 rounded-sm text-[rgb(168,169,171)] text-xs font-medium bg-[rgba(156,163,175,0.2)] mt-1.5"
    durationClass="text-xs text-white/50 font-medium rounded-sm mt-1.5"
  />
</MediaMenu>;
