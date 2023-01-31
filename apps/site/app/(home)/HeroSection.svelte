<script>
  import { addJSLibToPath, jsLib } from '$lib/stores/js-lib';

  import Button from '$lib/components/base/Button.svelte';
</script>

<section class="576:px-8 992:px-14 992:pt-12 1200:pb-16 mx-auto min-w-full max-w-6xl px-4">
  <div class="relative z-20 mt-4 flex flex-col items-center">
    <a
      class="flex items-center rounded-full bg-brand/10 text-brand py-1.5 px-4 hover:font-medium text-sm 768:text-base"
      href="https://github.com/vidstack/player/discussions/702"
      target="_blank"
      rel="noreferrer"
    >
      See our latest Community Skin designs
      <svg class="ml-1" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path
          d="M8.87844 8.04776C8.90448 8.02173 8.90448 7.97952 8.87844 7.95348L5.7197 4.79474C5.58953 4.66457 5.58953 4.45351 5.7197 4.32334L6.52109 3.52195C6.65126 3.39177 6.86232 3.39177 6.99249 3.52195L10.4194 6.94888C10.4246 6.95343 10.4296 6.95816 10.4345 6.96308L11.2359 7.76447C11.3661 7.89465 11.3661 8.1057 11.2359 8.23588L6.99327 12.4785C6.8631 12.6087 6.65204 12.6087 6.52187 12.4785L5.72048 11.6771C5.59031 11.547 5.59031 11.3359 5.72048 11.2057L8.87844 8.04776Z"
          fill="currentColor"
        />
      </svg>
    </a>

    <div class="flex flex-col items-center justify-center">
      <h1
        class="992:mt-6 768:text-5xl 768:leading-[3.5rem] 768:max-w-3xl 992:text-6xl 992:leading-[4.5rem] 992:max-w-5xl mt-8 text-center text-4xl font-extrabold leading-[3rem]"
      >
        Build your own
        <span class="text-transparent bg-gradient-to-r from-brand to-[#FB7185] bg-clip-text"
          >media player</span
        >
        only using HTML
        <span class="992:hidden">&</span>
        <span class="992:inline hidden">and</span>
        CSS
      </h1>

      <p
        class="text-soft 992:text-lg 576:text-xl mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed"
      >
        Open-source, accessible, and declarative player UI framework. Completely customizable,
        lightweight, rich with events and state management hooks.
      </p>

      <div class="mt-10 flex space-x-4">
        <Button primary type="raised" href={addJSLibToPath(`/docs/player`, $jsLib)}>
          Try Player Beta
        </Button>
      </div>
    </div>
  </div>
</section>
