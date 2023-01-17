<script>
  import MetaTags from '$lib/components/base/MetaTags.svelte';
  import MainLayout from '$lib/layouts/MainLayout.svelte';
  import Footer from '$lib/layouts/Footer.svelte';

  import HeroSection from './HeroSection.svelte';
</script>

<MetaTags
  title="Vidstack: Where people build awesome media experiences"
  description="Vidstack makes it easier to work with video & audio on the web."
/>

<MainLayout --navbar-border-bottom="none" --main-padding-x="none" --main-overflow-x="hidden">
  <HeroSection />

  <div class="flex flex-col items-center justify-center px-4 768:px-12 mb-10 768:mb-32">
    <h2
      class="font-bold text-3xl 768:text-4xl 992:text-5xl text-center leading-10 768:leading-[64px] mt-28 mb-20 768:mt-40 768:mb-20"
    >
      Built and designed for all devs
    </h2>

    <div class="grid grid-cols-1 gap-y-16 768:grid-cols-2 gap-x-32 768:gap-y-20">
      <div>
        <h3 class="font-semibold text-lg leading-8">Lightest Player on the Web</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          We’re committed to delivering the lightest player package possible. Vidstack Player is
          tree shakeable and completely modular. This means your final bundle will only consist of
          the code you have used. We don’t control your final package size, you do.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">Accessible</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Vidstack places a lot of importance on accessibility. If you look across the web today,
          media players are lacking attention in this space. An accessible player means everyone
          despite limitations and restrictions can watch or listen to your media.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">Fully customizable</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Vidstack Player is built with headless components so you’re in complete control of how
          they look. You can finally design the perfect media experience using only HTML and CSS.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8 inline-block">Community skin</h3>
        <div
          class="inline-block rounded-full bg-brand/10 text-brand py-0.5 px-2 font-medium text-sm ml-2 tracking-wide"
        >
          coming soon
        </div>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Vidstack Player comes with an out-of-the-box look. This means that if you don’t have the
          time and resources to go down a completely custom route, you can use our community skin to
          get up and running quickly.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">Framework agnostic</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          There’s a plethora of frontend libraries and frameworks to choose from today. We strive to
          provide a smooth development experience regardless of which you choose. Vidstack Player
          integrates with React, Vue, Svelte, Tailwind CSS, and more.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">Rich event system</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          The native events that come with players are not comprehensive, and often they done draw a
          clear line of events that occur upon player interactio. Our event system is build ontop of
          the native events, and all we’ve done is made it much more extensive.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">Tailwind plugin</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Tailwind is a popular CSS framework for the web, and since we’re focused on HTML and CSS
          and efficiency, it would make it much more enjoyable to design and build your player with
          an already awesome framework. Design your player even faster with the TailwindCSS plugin.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg leading-8">IDE integration</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Focusing on developer experience, as you’re coding, you would like to know what UI options
          you have without having to flip to our documentation then back. Our IDE integration guides
          you every step of the way, making your experience butter smooth.
        </p>
      </div>
    </div>
  </div>

  <Footer slot="after-main" />
</MainLayout>
