<script lang="ts">
  import clsx from 'clsx';
  import { isDarkColorScheme } from '../../stores/color-scheme';

  let _class: string | undefined = undefined;
  export { _class as class };
  export let darkClass: string | undefined = undefined;

  export let style: string | undefined = undefined;
  export let darkStyle: string | undefined = undefined;
</script>

<div
  class={clsx($isDarkColorScheme && darkClass ? darkClass : _class, 'contents')}
  style={$isDarkColorScheme && darkStyle ? darkStyle : style}
>
  <slot />
</div>
