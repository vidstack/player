<script context="module">
  export const __pageMeta = {
    title: 'IntersectionController'
  };
</script>

<script lang="ts">
  import { eventCallback, EventsAddon } from '@vitebook/client/addons';

  import { LitElement } from 'lit';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { IntersectionController } from './IntersectionController';

  class IntersectionObserverElement extends LitElement {
    controller = new IntersectionController(
      this,
      {
        // rootMargin: null,
        threshold: 1
        // skipInitial: false,
      },
      (entries) => {
        eventCallback({ type: 'intersection', ...entries });
      }
    );
  }

  safelyDefineCustomElement(
    'vds-intersection-observer',
    IntersectionObserverElement
  );

  let left = 100;
  let top = 100;

  let moving = false;

  function onMouseDown() {
    moving = true;
  }

  function onMouseMove(e) {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  }

  function onMouseUp() {
    moving = false;
  }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<vds-intersection-observer
  on:mousedown={onMouseDown}
  style="left: {left}px; top: {top}px;"
/>

<EventsAddon />

<style>
  vds-intersection-observer {
    position: absolute;
    user-select: none;
    cursor: move;
    width: 300px;
    height: 300px;
    background-color: red;
  }
</style>
