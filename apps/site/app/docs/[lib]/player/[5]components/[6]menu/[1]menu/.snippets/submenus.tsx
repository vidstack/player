<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <Submenu />
  </MediaMenuItems>
</MediaMenu>;

function Submenu() {
  return (
    <MediaMenu>
      <MediaMenuButton>
        <ArrowLeftIcon slot="close-icon" />
        <OdometerIcon slot="icon" />
        <span slot="label">Speed</span>
        <ChevronRightIcon slot="open-icon" />
      </MediaMenuButton>
      <MediaMenuItems>{/* ... */}</MediaMenuItems>
    </MediaMenu>
  );
}
