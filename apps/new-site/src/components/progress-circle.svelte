<script lang="ts">
  import clsx from 'clsx';

  let _class: string = '';
  export { _class as class };

  export let size: number;
  export let thickness = 40;
  export let percent: number;

  export let trackClass = '';
  export let fillClass = '';
</script>

<svg
  class={clsx('rounded-full', _class)}
  fill="none"
  viewBox="0 0 120 120"
  style={`width: ${size}px; height: ${size}px;`}
  aria-hidden="true"
>
  <circle class={trackClass} cx="60" cy="60" r="54" stroke="currentColor" stroke-width={thickness}
  ></circle>
  <circle
    class={fillClass}
    cx="60"
    cy="60"
    r="54"
    stroke="currentColor"
    stroke-width={thickness}
    stroke-dasharray="100"
    stroke-dashoffset={Math.max(0, 100 - percent)}
    pathLength="100"
  ></circle>
</svg>
