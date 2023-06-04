<script>
  let menu;

  let hint = 'Normal',
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

  function onChange(event) {
    const value = event.target.value;
    hint = value == '1' ? 'Normal' : value;
  }
</script>

<svelte:window on:pointerup={onWindowPointerUp} />

<media-player
  class="w-full h-[400px] flex items-center justify-center"
  on:pointerup|stopPropagation={onPointerUp}
>
  <media-menu class="mt-32" on:attached={onAttached}>
    <media-menu-button aria-label="Settings">
      <media-icon type="settings" data-rotate />
    </media-menu-button>
    <media-menu-items style="--menu-height: 66px;">
      <media-menu>
        <media-menu-button>
          <media-icon type="arrow-left" slot="close-icon" />
          <media-icon type="odometer" slot="icon" />
          <span slot="label">Playback Rate</span>
          <span class="ml-auto hint-text">{hint}</span>
          <media-icon class="ml-0" type="chevron-right" slot="open-icon" />
        </media-menu-button>
        <media-menu-items>
          <media-radio-group value="1" on:change={onChange}>
            <media-radio value="1">Normal</media-radio>
            <media-radio value="2">2x</media-radio>
          </media-radio-group>
        </media-menu-items>
      </media-menu>
      <media-menu />
    </media-menu-items>
  </media-menu>
</media-player>

<style>
  .hint-text {
    font-size: 15px;
    color: rgba(245, 245, 245, 0.5);
  }
</style>
