<script>
  import clsx from 'clsx';

  let __class = '';
  export { __class as class };
</script>

<div
  class={clsx('table-wrapper overflow-auto scrollbar scroll-contain my-[2em]', __class)}
  style=""
>
  <table>
    <slot />
  </table>
</div>
