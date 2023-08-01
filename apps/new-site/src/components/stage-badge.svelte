<script lang="ts" context="module">
  import type { BadgeColor } from './badge.svelte';

  export type StageTitle = '1.0' | 'Beta' | 'Alpha' | 'Soon' | 'Planned';

  function getColor(stage: StageTitle): BadgeColor {
    switch (stage) {
      case '1.0':
        return 'blue';
      case 'Beta':
        return 'green';
      case 'Alpha':
        return 'yellow';
      case 'Soon':
        return 'purple';
      case 'Planned':
        return 'orange';
    }
  }
</script>

<script lang="ts">
  import Badge from './badge.svelte';

  export let stage: StageTitle;
  export let invertTheme = false;
</script>

<Badge color={getColor(stage)} {invertTheme}>{stage}</Badge>
