<script lang="ts" context="module">
  const STEPS_CTX_KEY = Symbol();

  export type StepsContext = {
    steps: Readable<number>;
    register: () => number;
  };

  export function getStepsContext(): StepsContext {
    return getContext(STEPS_CTX_KEY);
  }
</script>

<script lang="ts">
  import { getContext, onDestroy, setContext } from 'svelte';
  import { get, writable, type Readable } from 'svelte/store';

  const steps = writable(0);

  setContext<StepsContext>(STEPS_CTX_KEY, {
    steps,
    register() {
      steps.update((s) => s + 1);

      onDestroy(() => {
        steps.update((s) => s - 1);
      });

      return get(steps);
    },
  });
</script>

<ol class="steps relative m-0 list-none space-y-6 p-0 992:space-y-4" style="counter-reset: 0;">
  <slot />
</ol>
