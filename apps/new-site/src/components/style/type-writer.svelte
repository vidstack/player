<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher<{
    end: void;
  }>();

  export let text: string;
  export let speed = 50;
  export let delay = 0;

  let _class = '';
  export { _class as class };

  let typedText = '',
    charIndex = 0,
    mounted = false,
    timerId = -1;

  onMount(() => {
    mounted = true;
  });

  function type(text: string) {
    if (charIndex >= text.length) {
      dispatch('end');
      return;
    }

    typedText += text.charAt(charIndex);
    charIndex++;
    timerId = window.setTimeout(() => type(text), speed);
  }

  function onTextChange(text: string) {
    typedText = '';
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      type(text);
    }, delay);
  }

  $: if (mounted) {
    onTextChange(text);
  }
</script>

<span class={_class} aria-live="polite">{typedText}</span>
