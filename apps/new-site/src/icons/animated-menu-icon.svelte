<script lang="ts">
  import clsx from 'clsx';

  export let size = 26;
  export let open: boolean;
</script>

<svg
  class={clsx(open && 'open')}
  fill="none"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <g>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16" />
  </g>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
  <g>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 18h16" />
  </g>
</svg>

<style>
  /* Groups */

  g {
    transform-origin: 50%;
    transform: rotate(var(--rotate, 0deg));
  }

  .open > g {
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.2s;
  }

  .open > g:first-child {
    --rotate: 45deg;
  }

  .open > g:last-child {
    --rotate: -45deg;
  }

  /* Paths */

  path {
    opacity: 1;
    transition:
      transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.2s,
      opacity 0.2s 0.2s;
  }

  .open > path {
    opacity: 0;
  }

  .open path {
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .open > g:first-child > path {
    transform: translateY(6px);
  }

  .open > g:last-child > path {
    transform: translateY(-6px);
  }
</style>
