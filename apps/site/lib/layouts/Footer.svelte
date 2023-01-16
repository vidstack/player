<script lang="ts">
  import SocialLink from '$lib/components/social/SocialLink.svelte';
  import vidstackLogo from '$lib/img/brand/vidstack-logo.svg?raw';
  import vidstackSymbol from '$lib/img/brand/vidstack-symbol.svg?raw';
</script>

<footer class="576:px-8 mt-28 w-full px-6 py-10 text-base">
  <div class="mx-auto w-full max-w-[var(--navbar-max-width)]">
    <div class="flex flex-col">
      <div class="576:flex-row 576:space-y-0 576:space-x-16 flex flex-col space-y-10">
        <div class="576:flex-col 576:items-start flex flex-row items-center">
          <div
            class="text-inverse svg-responsive 992:inline-block hidden h-[26px] w-[128px] overflow-hidden"
          >
            {@html vidstackLogo}
          </div>
          <div class="svg-responsive 992:hidden -ml-2 mt-0.5 h-9 w-9 overflow-hidden">
            {@html vidstackSymbol}
          </div>
          <div class="576:hidden pointer-events-none flex-1" />
          <div
            class="576:mr-0 576:space-x-0 576:flex-col 576:space-y-2 576:-ml-2 576:mt-8 -mr-2 flex flex-row space-x-2"
          >
            <SocialLink class="768:w-6 768:h-6 h-7 w-7" type="twitter" showTitle />
            <SocialLink class="768:w-6 768:h-6 h-7 w-7" type="discord" showTitle />
            <SocialLink class="768:w-6 768:h-6 h-7 w-7" type="gitHub" showTitle />
          </div>
        </div>

        <div class="576:inline-block 576:flex-1 pointer-events-none hidden" />

        <section class="flex flex-col">
          <h1 class="text-lg font-semibold">Getting Started</h1>
          <ul class="text-soft mt-4 space-y-4">
            <li class="hover:text-inverse">
              <a href="/docs/player/getting-started/installation">Installation</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/player/getting-started/foundation">Foundation</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/player/getting-started/styling">Styling</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/player/getting-started/events">Events</a>
            </li>
          </ul>
        </section>

        <section class="flex flex-col">
          <h1 class="text-lg font-semibold">Frameworks</h1>
          <ul class="text-soft mt-4 space-y-4">
            <li class="hover:text-inverse">
              <a href="/docs/player/getting-started/installation">HTML</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/react/player/getting-started/installation">React</a>
            </li>
          </ul>
        </section>

        <section class="flex flex-col">
          <h1 class="text-lg font-semibold">Providers</h1>
          <ul class="text-soft mt-4 space-y-4">
            <li class="hover:text-inverse">
              <a href="/docs/player/components/providers/audio">Audio</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/player/components/providers/video">Video</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/docs/player/components/providers/hls">HLS</a>
            </li>
          </ul>
        </section>

        <!-- <section class="flex flex-col">
          <h1 class="text-lg font-bold">Resources</h1>
          <ul class="text-soft mt-4 space-y-4">
            <li class="hover:text-inverse">
              <a href="/blog">Blog</a>
            </li>
            <li class="hover:text-inverse">
              <a href="/privacy-policy/>Privacy</a>
            </li>
          </ul>
        </section> -->
      </div>

      <span class="576:flex-row text-soft mt-16 flex flex-col text-left text-sm leading-relaxed">
        <div>
          Vidstack Player is released under
          <a
            class="hover:text-inverse hover:border-inverse border-b-[1.5px]"
            href="https://github.com/vidstack/vidstack/blob/main/packages/player/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            MIT License
          </a>
        </div>

        <div class="flex-1" />

        <div class="576:mt-0 mt-2">
          Vidstack © {new Date().getFullYear()}
        </div>
      </span>
    </div>
  </div>
</footer>
