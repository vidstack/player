<script context="module">
  export const __pageMeta = {
    title: 'IntersectionController'
  };
</script>

<script lang="ts">
  import { eventCallback, EventsAddon } from '@vitebook/client/addons';

  import { html, LitElement } from 'lit';
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
        const logKeys = ['intersectionRatio', 'isIntersecting', 'isVisible'];

        const values = logKeys.reduce(
          (p, k) => ({ ...p, [k]: entries[0][k] }),
          {}
        );

        eventCallback(
          { type: 'intersection', timeStamp: Date.now(), ...values },
          logKeys
        );
      }
    );

    override render() {
      return html`<slot></slot>`;
    }
  }

  safelyDefineCustomElement(
    'vds-intersection-observer',
    IntersectionObserverElement
  );

  let left = 20;
  let top = 20;

  let moving = false;

  function onPointerDown() {
    moving = true;
  }

  function onPointerMove(e) {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  }

  function onPointerUp() {
    moving = false;
  }
</script>

<svelte:window on:pointerup={onPointerUp} on:pointermove={onPointerMove} />

<vds-intersection-observer
  on:pointerdown={onPointerDown}
  style="left: {left}px; top: {top}px;"
>
  <span class="drag-text">DRAG ME</span>
</vds-intersection-observer>

<EventsAddon />

<style>
  vds-intersection-observer {
    position: absolute;
    cursor: move;
    width: 300px;
    height: 300px;
    background-color: orange;
    user-select: none;
    -webkit-user-select: none;
  }

  .drag-text {
    width: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: black;
    user-select: none;
    -webkit-user-select: none;
  }
</style>
