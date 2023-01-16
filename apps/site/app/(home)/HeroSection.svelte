<script>
  import { addJSLibToPath, jsLib } from '$lib/stores/js-lib';

  import Button from '$lib/components/base/Button.svelte';
</script>

<section class="576:px-8 992:px-14 992:pt-12 1200:pb-16 mx-auto min-w-full max-w-6xl px-4">
  <div class="relative z-20 mt-4 flex flex-col">
    <div class="flex flex-col items-center justify-center">
      <h1
        class="992:mt-6 768:text-5xl 768:leading-[3.5rem] 768:max-w-3xl 992:text-6xl 992:leading-[4.5rem] 992:max-w-5xl mt-8 text-center text-4xl font-extrabold leading-[3rem]"
      >
        Build a modern media player only using HTML
        <span class="992:hidden">&</span>
        <span class="992:inline hidden">and</span>
        CSS
      </h1>

      <p
        class="text-soft 992:text-lg 576:text-xl mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed"
      >
        Open-source, accessible, and declarative player UI framework. Completely customizable,
        lightweight, and packed with rich media events.
      </p>

      <div class="mt-12 flex space-x-4">
        <Button primary type="raised" href={addJSLibToPath(`/docs/player`, $jsLib)}>
          Try Player Beta
        </Button>
      </div>
    </div>
  </div>
</section>
