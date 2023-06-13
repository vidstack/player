<script>
  import { isKeyboardClick } from '$lib/utils/keyboard';
  import clsx from 'clsx';

  let pressed = true;

  function onPress() {
    pressed = !pressed;
  }
</script>

<div
  class={clsx(
    'dark:bg-body/80 bg-white/80 text-black dark:text-white rounded-md px-2.5 py-1 text-lg mb-8',
    !pressed && 'opacity-0',
  )}
>
  Hello, I'm a captions box!
</div>

<media-player class="w-full flex justify-center">
  <media-toggle-button
    default-pressed
    on:click={onPress}
    on:keyup={(e) => isKeyboardClick(e) && onPress()}
  >
    <media-icon type="closed-captions-on" slot="on" />
    <media-icon type="closed-captions" slot="off" />
  </media-toggle-button>
</media-player>
