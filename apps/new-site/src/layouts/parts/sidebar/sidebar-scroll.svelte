<script lang="ts">
  import { onMount } from 'svelte';

  import { scrollIntoCenter } from '../../../utils/scroll';

  onMount(() => {
    setTimeout(() => {
      const container = document.getElementById('main-sidebar')!,
        activeItem = container.querySelector('[data-active]');
      if (activeItem) scrollIntoCenter(container, activeItem, { behaviour: 'smooth' });
    }, 300);
  });
</script>
