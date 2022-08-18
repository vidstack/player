<script lang="ts">
  import clsx from 'clsx';

  export let color: 'pink' | 'rose' | 'orange';

  let _class = '';
  export { _class as class };
</script>

<div
  class={clsx(
    '992:w-[500px] 992:h-[500px] h-[250px] w-[250px] rounded-full blur-[25px] filter dark:blur-[40px]',
    _class,
  )}
  style={`background: var(--gradient-radial-${color});`}
/>
