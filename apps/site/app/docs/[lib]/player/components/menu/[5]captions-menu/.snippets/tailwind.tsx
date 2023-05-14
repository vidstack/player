function SettingsMenu() {
  return (
    <MediaMenu className="relative inline-block">
      <MediaMenuButton
        className="group flex h-12 w-12 items-center justify-center rounded-sm outline-none"
        aria-label="Settings"
      >
        <SettingsIcon className="h-8 w-8 rounded-sm transition-transform duration-200 ease-out group-aria-expanded:rotate-90 group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400" />
      </MediaMenuButton>
      <MediaMenuItems className="absolute right-0 bottom-full h-[var(--menu-height)] min-w-[260px] overflow-y-auto rounded-lg bg-black/95 p-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in aria-hidden:pointer-events-none aria-hidden:bottom-0 aria-hidden:opacity-0 data-[resizing]:overflow-hidden">
        <CaptionsMenu />
      </MediaMenuItems>
    </MediaMenu>
  );
}

function CaptionsMenu() {
  return (
    <MediaMenu className="text-sm text-white">
      <CaptionsMenuButton />
      <MediaCaptionsMenuItems
        className="relative flex flex-col p-1 aria-hidden:hidden"
        radioGroupClass="w-full"
        radioClass="group flex cursor-pointer items-center p-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-2 data-[focus]:ring-blue-400"
        radioCheckClass="rounded-full border-1 flex items-center justify-center w-2.5 h-2.5 mr-2 border-gray-500 group-aria-checked:border-white after:content-[''] after:border-2 after:border-white after:hidden group-aria-checked:after:inline-block after:rounded-full after:w-1 after:h-1"
      />
    </MediaMenu>
  );
}

function CaptionsMenuButton() {
  return (
    <MediaMenuButton className="group flex cursor-pointer items-center p-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-2 data-[focus]:ring-blue-400">
      <ArrowLeftIcon className="hidden h-4 w-4 group-aria-expanded:inline" />
      <ClosedCaptionsIcon className="h-6 w-6 group-aria-expanded:hidden" />
      <span className="ml-1.5">Captions</span>
      <span className="ml-auto text-white/50" slot="hint"></span>
      <ChevronRightIcon className="ml-0.5 h-4 w-4 text-white/50 group-aria-expanded:hidden group-aria-disabled:opacity-0" />
    </MediaMenuButton>
  );
}
