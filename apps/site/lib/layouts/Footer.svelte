<script lang="ts">
  import vidstackLogo from '$lib/img/brand/vidstack-logo.svg?raw';
  import vidstackSymbol from '$lib/img/brand/vidstack-symbol.svg?raw';
</script>

<footer class="768:px-8 w-full px-6 py-10 text-base">
  <div class="mx-auto w-full max-w-[var(--navbar-max-width)]">
    <div class="w-full flex mb-8 768:mb-16 992:pr-10">
      <div class="flex-1" />
      <div class="rounded-full w-20 h-6 border-border border-2" />
      <div class="rounded-full w-6 h-6 border-border border-2 ml-3" />
    </div>

    <div class="flex flex-col">
      <div class="768:flex-row 768:space-y-0 768:space-x-16 flex flex-col space-y-10">
        <div class="768:flex-col 768:items-start flex flex-row items-center">
          <div
            class="text-inverse svg-responsive 992:inline-block hidden h-[26px] w-[128px] overflow-hidden"
          >
            {@html vidstackLogo}
          </div>
          <div class="svg-responsive 992:hidden -ml-2 mt-0.5 h-9 w-9 overflow-hidden">
            {@html vidstackSymbol}
          </div>
        </div>

        <div class="768:inline-block 768:flex-1 pointer-events-none hidden" />

        <div class="flex pl-2 420:pl-0 420:justify-center 768:justify-start">
          <div
            class="grid grid-cols-1 grid-rows-1 420:grid-cols-2 420:grid-rows-2 gap-x-20 gap-y-16 576:grid-cols-3 768:grid-cols-3 768:grid-rows-2 768:gap-x-16 992:grid-cols-4 992:grid-rows-1"
          >
            <section class="flex flex-col">
              <h1 class="text-[15px] font-semibold">Getting Started</h1>
              <ul class="text-soft mt-4 space-y-4">
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/getting-started/installation">Installation</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/getting-started/editor-setup">Editor Setup</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/core-concepts/architecture">Architecture</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/core-concepts/styling">Styling</a>
                </li>
              </ul>
            </section>

            <section class="flex flex-col">
              <h1 class="text-base font-semibold">Frameworks</h1>
              <ul class="text-soft mt-4 space-y-4">
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/getting-started/installation">HTML</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/react/player/getting-started/installation">React</a>
                </li>
              </ul>
            </section>

            <section class="flex flex-col">
              <h1 class="text-base font-semibold">Providers</h1>
              <ul class="text-soft mt-4 space-y-4">
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/providers/audio">Audio</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/providers/video">Video</a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="/docs/player/providers/hls">HLS Video</a>
                </li>
              </ul>
            </section>

            <section class="flex flex-col">
              <h1 class="text-base font-bold">Socials</h1>
              <ul class="text-soft mt-4 space-y-4">
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="https://twitter.com/vidstackjs?lang=en" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="https://github.com/vidstack" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li class="text-soft hover:font-medium font-base hover:underline hover:text-brand">
                  <a href="https://discord.gg/QAjfh2gZE4" target="_blank" rel="noreferrer">
                    Discord
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <span class="768:flex-row text-soft mt-16 flex flex-col text-left text-sm leading-relaxed">
        <div class="text-center 576:text-left">
          © {new Date().getFullYear()} Vidstack
        </div>
      </span>
    </div>
  </div>
</footer>
