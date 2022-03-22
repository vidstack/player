<script lang="ts">
  import clsx from 'clsx';
  import { ariaBool } from '@vidstack/foundation';

  export let id = null;
  export let visible = false;

  let __class = '';
  export { __class as class };
</script>

<div
  {id}
  class={clsx('transition-opacity mt-1 z-50', !visible && 'opacity-0 invisible', __class)}
  role="tooltip"
  aria-hidden={ariaBool(!visible)}
>
  <span
    class="flex items-center justify-center rounded-sm bg-gray-elevate py-1.5 px-2 text-sm font-medium tracking-wider shadow-sm dark:border-2"
  >
    <slot />
  </span>
</div>
