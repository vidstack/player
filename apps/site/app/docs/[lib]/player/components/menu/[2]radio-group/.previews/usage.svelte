<script>
  let menu;

  function onAttached(event) {
    menu = event.target;
    menu.open(event);
  }

  function onPointerUp(event) {
    menu?.close(event);
  }

  function onWindowPointerUp(event) {
    event.stopImmediatePropagation();
  }
</script>

<svelte:window on:pointerup={onWindowPointerUp} />

<div
  class="w-full h-full flex items-center justify-center"
  on:pointerup|stopPropagation={onPointerUp}
>
  <media-menu class="mt-32" on:attached={onAttached}>
    <media-menu-button aria-label="Settings">
      <media-icon type="settings" data-rotate />
    </media-menu-button>
    <media-menu-items>
      <media-radio-group value="720">
        <media-radio value="1080">1080p</media-radio>
        <media-radio value="720">720p</media-radio>
        <media-radio value="480">480p</media-radio>
      </media-radio-group>
    </media-menu-items>
  </media-menu>
</div>
