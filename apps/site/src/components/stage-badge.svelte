<script lang="ts" context="module">
  import type { BadgeColor } from './badge.svelte';

  export type StageTitle = number | 'Beta' | 'Alpha' | 'Soon' | 'Planned' | 'Archived';

  function getColor(stage: StageTitle): BadgeColor {
    switch (stage) {
      case 'Beta':
        return 'green';
      case 'Alpha':
        return 'yellow';
      case 'Soon':
        return 'purple';
      case 'Planned':
        return 'orange';
      case 'Archived':
        return 'red';
      default:
        return 'blue';
    }
  }
</script>

<script lang="ts">
  import Badge from './badge.svelte';

  export let stage: StageTitle;

  $: title = typeof stage === 'number' ? stage + '.0' : stage;
</script>

<Badge color={getColor(stage)}>{title}</Badge>
