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

  let _class: string | undefined = undefined;
  export { _class as class };

  export let stage: StageTitle;

  $: title = typeof stage === 'number' ? stage + '.0' : stage;
</script>

<Badge class={_class} color={getColor(stage)}>{title}</Badge>
