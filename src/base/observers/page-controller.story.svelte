<script context="module">
  export const __pageMeta = {
    title: 'PageController'
  };
</script>

<script lang="ts">
  import { eventCallback, EventsAddon } from '@vitebook/client/addons';

  import { html, LitElement } from 'lit';
  import { state } from 'lit/decorators.js';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { PageController } from './PageController';

  class PageObserverElement extends LitElement {
    protected _timeout;
    protected _interval;

    @state() protected _count = 0;

    controller = new PageController(this, ({ state, visibility }) => {
      eventCallback(
        { type: 'change', state, visibility, timeStamp: Date.now() },
        ['state', 'visibility']
      );

      window.clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        if (state === 'hidden') {
          this._stopCount();
        } else {
          this._startCount();
        }
      }, 500);
    });

    override connectedCallback() {
      super.connectedCallback();
      this._startCount();
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this._stopCount();
    }

    protected _startCount() {
      this.style.backgroundColor = 'green';
      this._interval = window.setInterval(() => {
        this._count += 1;
      }, 1000);
    }

    protected _stopCount() {
      this.style.backgroundColor = 'red';
      window.clearInterval(this._interval);
    }

    override render() {
      return html`
        <div
          style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"
        >
          <span style="font-size: 24px;">${this._count}</span>
        </div>
      `;
    }
  }

  safelyDefineCustomElement('vds-page-observer', PageObserverElement);
</script>

<vds-page-observer />

<EventsAddon />

<style>
  vds-page-observer {
    width: 300px;
    height: 300px;
  }
</style>
