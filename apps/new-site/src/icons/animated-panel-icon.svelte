<script lang="ts">
  import clsx from 'clsx';

  export let size = 24;
  export let open: boolean;
</script>

<svg
  fill="none"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <g
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path
      class={clsx('transition-transform duration-300 origin-center', !open && 'rotate-180')}
      d="M9 3v18m7-6l-3-3l3-3"
    />
  </g>
</svg>
