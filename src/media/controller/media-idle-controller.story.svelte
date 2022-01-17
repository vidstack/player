<script context="module">
  export const __pageMeta = {
    title: 'MediaIdleController'
  };
</script>

<script lang="ts">
  import { safelyDefineCustomElement } from '../../utils/dom';
  import {
    eventCallback,
    EventsAddon,
    ControlsAddon
  } from '@vitebook/client/addons';
  import { MediaIdleController } from './MediaIdleController';
  import { html, LitElement } from 'lit';
  import { writable } from '../../base/stores';

  let idle = false;

  const paused = writable(true);

  class IdleHostElement extends LitElement {
    _controller = new MediaIdleController(this, { paused });

    override connectedCallback() {
      super.connectedCallback();
    }

    override render() {
      return html`<slot></slot>`;
    }
  }

  safelyDefineCustomElement('vds-idle-host', IdleHostElement);

  function handleIdleChange(event) {
    idle = event.detail;
    eventCallback(event, ['detail']);
  }
</script>

<vds-idle-host on:vds-idle-change={handleIdleChange}>
  <div class="idle-indicator" class:idle />
</vds-idle-host>

<ControlsAddon>
  <label>
    Emulate Paused
    <input type="checkbox" bind:checked={$paused} />
  </label>
</ControlsAddon>

<EventsAddon />

<style>
  .idle-indicator {
    width: 300px;
    height: 300px;
    background-color: red;
  }

  .idle-indicator.idle {
    background-color: green;
  }
</style>
