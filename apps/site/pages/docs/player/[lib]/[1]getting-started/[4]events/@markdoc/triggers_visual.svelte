<script>
  import Chip from '$src/components/base/Chip.svelte';
  import ArrowRightIcon from '~icons/ri/arrow-right-s-fill';

  export const events = [
    'pointerdown (origin)',
    'vds-play-request',
    'play (native)',
    'vds-play',
    'playing (native)',
    'vds-playing',
  ];
</script>

<div class="flex items-center flex-wrap space-y-2 mt-4 mb-10" style="--chip-border-radius: 5px;">
  <div />

  {#each events.reverse() as event, i}
    <Chip>{event}</Chip>
    <ArrowRightIcon class="mx-1" width="20" height="20" />
  {/each}

  <Chip class="mt-2">null</Chip>
</div>
