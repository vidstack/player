<script context="module">
  export const __pageMeta = {
    title: 'PageController'
  };
</script>

<script lang="ts">
  import { events, EventsAddon } from '@vitebook/client/addons';

  import { LitElement } from 'lit';
  import { get } from 'svelte/store';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { PageController } from './PageController';

  class PageObserverElement extends LitElement {
    protected _timeout;

    override connectedCallback() {
      super.connectedCallback();
      this.style.backgroundColor = 'green';
    }

    controller = new PageController(this, ({ state, visibility }) => {
      // TODO: work around below to show event details in events addon - fix in Vitebook later.
      const event = { type: 'change', state, visibility };

      get(events).unshift({
        id: Symbol(),
        ref: event as any,
        stringify: () => JSON.stringify(event, null, 2)
      });

      events.set(get(events));

      window.clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        this.style.backgroundColor = state === 'hidden' ? 'red' : 'green';
      }, 300);
    });
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
