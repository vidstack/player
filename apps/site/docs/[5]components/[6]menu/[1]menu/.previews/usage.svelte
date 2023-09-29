<script>
  let menu,
    allow = Symbol();

  function onAttached(event) {
    menu = event.target;
    requestAnimationFrame(() => {
      menu.open(event);
    });
  }

  function onPointerUp(event) {
    menu?.close(event);
    const forward = new PointerEvent('pointerup', event);
    forward[allow] = true;
    window.dispatchEvent(forward);
  }

  function onWindowPointerUp(event) {
    if (!event[allow]) event.stopImmediatePropagation();
  }
</script>

<svelte:window on:pointerup={onWindowPointerUp} />

<media-player
  class="w-full h-[400px] flex items-center justify-center"
  on:pointerup|stopPropagation={onPointerUp}
>
  <media-menu on:attached={onAttached}>
    <media-menu-button aria-label="Settings">
      <media-icon type="settings" data-rotate />
    </media-menu-button>
    <media-menu-items style="--menu-height: 114px;">
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
</media-player>
