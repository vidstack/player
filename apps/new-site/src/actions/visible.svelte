<script lang="ts">
  import clsx from 'clsx';

  import { visible } from './visible';

  export let root: Element | Document | null = null;
  export let rootMargin: string | undefined = undefined;
  export let threshold: number | number[] | undefined = undefined;
  export let style: string | null = null;
  export let once = false;
</script>

<span
  {...$$restProps}
  class={clsx($$restProps.class, 'w-full')}
  {style}
  use:visible={{ root, rootMargin, threshold, once }}
>
  <slot />
</span>
