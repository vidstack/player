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
      <media-menu>
        <media-menu-button>
          <media-icon type="arrow-left" slot="close-icon" />
          <media-icon type="settings-menu" slot="icon" />
          <span slot="label">Submenu A</span>
          <media-icon type="chevron-right" slot="open-icon" />
        </media-menu-button>
        <media-menu-items>
          <media-radio-group value="a">
            <media-radio value="a">Option A</media-radio>
            <media-radio value="b">Option B</media-radio>
          </media-radio-group>
        </media-menu-items>
      </media-menu>
      <media-menu>
        <media-menu-button>
          <media-icon type="arrow-left" slot="close-icon" />
          <media-icon type="settings-menu" slot="icon" />
          <span slot="label">Submenu B</span>
          <media-icon type="chevron-right" slot="open-icon" />
        </media-menu-button>
        <media-menu-items>
          <media-radio-group value="b">
            <media-radio value="a">Option A</media-radio>
            <media-radio value="b">Option B</media-radio>
          </media-radio-group>
        </media-menu-items>
      </media-menu>
    </media-menu-items>
  </media-menu>
</div>
