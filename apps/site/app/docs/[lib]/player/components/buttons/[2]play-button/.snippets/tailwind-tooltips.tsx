import { MediaPlayButton, PauseIcon, PlayIcon } from '@vidstack/react';

function PlayButton() {
  const tooltipId = 'media-play-tooltip';

  return (
    <MediaPlayButton
      className="group flex h-12 w-12 items-center justify-center rounded-sm text-white"
      aria-describedby={tooltipId}
    >
      {/* icons */}
      <PlayIcon className="paused:block hidden" />
      <PauseIcon className="not-paused:block hidden" />
      {/* tooltip */}
      <div
        id={tooltipId}
        className="ease pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-2.5 scale-75 transform whitespace-nowrap rounded-sm bg-black py-1 px-2 font-sans text-xs text-white opacity-0 transition-all duration-200 group-hover:-translate-x-1/2 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:-translate-x-1/2 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        role="tooltip"
        style={{ transformOrigin: '50% 100%' }}
      >
        <span className="paused:inline hidden">Play</span>
        <span className="not-paused:inline hidden">Pause</span>
      </div>
    </MediaPlayButton>
  );
}
