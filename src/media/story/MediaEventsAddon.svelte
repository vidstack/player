<script lang="ts">
  import {
    EventsAddon,
    eventCallback,
    throttledEventCallback
  } from '@vitebook/client/addons';
  import { onDestroy } from 'svelte';
  import { DisposalBin, listen } from '../../base/events';
  import { type MediaEvents } from '../events';
  import { type MediaProviderElement } from '../provider';

  export let mediaProvider: MediaProviderElement | null = null;

  const disposal = new DisposalBin();

  const events: (keyof MediaEvents)[] = [
    'vds-abort',
    'vds-autoplay-attempt',
    'vds-autoplay-change',
    'vds-autoplay-fail',
    'vds-autoplay',
    'vds-can-play-through',
    'vds-can-play',
    'vds-controls-change',
    'vds-duration-change',
    'vds-emptied',
    'vds-ended',
    'vds-error',
    'vds-fullscreen-change',
    'vds-fullscreen-error',
    'vds-fullscreen-support-change',
    'vds-load-start',
    'vds-loaded-data',
    'vds-loaded-metadata',
    'vds-loop-change',
    'vds-looped',
    'vds-media-type-change',
    'vds-pause',
    'vds-play-fail',
    'vds-play',
    'vds-playing',
    'vds-playsinline-change',
    'vds-poster-change',
    'vds-progress',
    'vds-replay',
    'vds-seeked',
    'vds-seeking',
    'vds-src-change',
    'vds-stalled',
    'vds-started',
    'vds-suspend',
    'vds-time-update',
    'vds-view-type-change',
    'vds-volume-change',
    'vds-waiting'
  ];

  const throttle = {
    'vds-time-update': 500,
    'vds-volume-change': 500
  };

  $: if (mediaProvider) {
    events.forEach((event) => {
      disposal.add(
        listen(
          mediaProvider!,
          event,
          throttle[event]
            ? throttledEventCallback(throttle[event])
            : eventCallback
        )
      );
    });
  } else {
    disposal.empty();
  }

  onDestroy(() => {
    disposal.empty();
  });
</script>

<EventsAddon />
