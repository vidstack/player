function MediaControls() {
  return (
    <div
      className="can-control:opacity-100 pointer-events-none absolute inset-0 z-10 flex h-full flex-col justify-between text-white opacity-0 transition-opacity duration-200 ease-linear"
      role="group"
      aria-label="Media Controls"
    >
      <MediaControlGroup>Controls Top</MediaControlGroup>
      <MediaControlGroup>Controls Middle</MediaControlGroup>
      <MediaControlGroup>Controls Bottom</MediaControlGroup>
    </div>
  );
}

function MediaControlGroup({ children }) {
  return (
    <div className="can-control:pointer-events-auto pointer-events-none flex min-h-[48px] w-full p-2">
      {children}
    </div>
  );
}
