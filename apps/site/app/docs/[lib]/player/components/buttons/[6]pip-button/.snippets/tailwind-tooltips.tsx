import { MediaPIPButton, PictureInPictureExitIcon, PictureInPictureIcon } from '@vidstack/react';

function PIPButton() {
  const tooltipId = 'media-pip-tooltip';

  return (
    <MediaPIPButton
      className="group flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
      aria-describedby={tooltipId}
    >
      {/* icons */}
      <PictureInPictureIcon className="not-pip:block hidden" />
      <PictureInPictureExitIcon className="pip:block hidden" />
      {/* tooltip */}
      <div
        id={tooltipId}
        className="ease pointer-events-none absolute bottom-full left-1/2 mb-4 -translate-x-1/2 translate-y-2.5 scale-75 transform whitespace-nowrap rounded-sm bg-black py-1 px-2 font-sans text-xs text-white opacity-0 transition-all duration-200 group-data-[hocus]:-translate-x-1/2 group-data-[hocus]:scale-100 group-data-[hocus]:opacity-100"
        role="tooltip"
        style={{ transformOrigin: '50% 100%' }}
      >
        <span className="not-pip:inline hidden">Enter PIP</span>
        <span className="pip:inline hidden">Exit PIP</span>
      </div>
    </MediaPIPButton>
  );
}
