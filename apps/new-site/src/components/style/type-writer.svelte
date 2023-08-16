<script lang="ts">
  import { onMount } from 'svelte';

  export let text: string;
  export let speed = 50;
  export let delay = 0;

  let typedText = '',
    charIndex = 0;

  onMount(() => {
    setTimeout(() => {
      type();
    }, delay);
  });

  function type() {
    if (charIndex >= text.length) return;
    typedText += text.charAt(charIndex);
    charIndex++;
    window.setTimeout(type, speed);
  }
</script>

<span aria-live="polite">{typedText}</span>
