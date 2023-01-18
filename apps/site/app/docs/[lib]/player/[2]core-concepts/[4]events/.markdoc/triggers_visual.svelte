<script>
  import Chip from '$lib/components/base/Chip.svelte';
  import ArrowRightIcon from '~icons/ri/arrow-right-s-fill';

  export const events = [
    'pointerup (origin)',
    'media-play-request',
    'play (native)',
    'play (vidstack)',
    'playing (native)',
    'playing (vidstack)',
  ];
</script>

<div class="mt-4 mb-10 flex flex-wrap items-center space-y-2" style="--chip-border-radius: 5px;">
  <div />

  {#each events.reverse() as event, i}
    <Chip>{event}</Chip>
    <ArrowRightIcon class="mx-1" width="20" height="20" />
  {/each}

  <Chip class="mt-2">null</Chip>
</div>
