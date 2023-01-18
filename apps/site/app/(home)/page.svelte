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

  <div
    class="flex flex-col items-center justify-center px-4 768:px-12 mb-10 768:mb-32 mt-28 768:mt-20"
  >
    <div class="grid grid-cols-1 gap-y-16 768:grid-cols-2 gap-x-32 768:gap-y-20">
      <div>
        <div class="text-brand text-[15px] font-medium">Performant</div>
        <h3 class="font-semibold text-lg leading-8 mt-2">
          The package is tiny - use only what you need
        </h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          We’re committed to delivering the lightest and fastest player package possible. Vidstack
          Player is tree-shakeable and completely modular. Not only that, but we're one of the only
          players that can SSR out of the box!
        </p>
      </div>
      <div>
        <div class="text-brand text-[15px] font-medium">Accessible</div>
        <h3 class="font-semibold text-lg leading-8 mt-2">
          Deliver an experience everyone can enjoy
        </h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          A good media player experience does not get in the way of a user, rather it meets their
          needs. We follow ARIA guidelines by applying roles and labels for screen readers, provide
          a variety of device input feedback, keyboard shortcuts, and captions.
        </p>
      </div>
      <div>
        <div class="text-brand text-[15px] font-medium">Customizable</div>
        <h3 class="font-semibold text-lg leading-8 mt-2">Design the player you've always wanted</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          We have multiple provider integrations, expose media state as attributes so you can style
          with CSS, expansive collection of UI components that are easily themed out of the box, and
          even the option to go completely headless.
        </p>
      </div>
      <div>
        <div class="text-brand text-[15px] font-medium">Skins</div>
        <h3 class="font-semibold text-lg leading-8 inline-block mt-2">
          Ship faster with our community skin
        </h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          If you don’t have the time and resources to go down a completely custom route, you can use
          our community skin to get up and running quickly. Our designs are built with the highest
          quality and target audio, video, live, and live DVR.
        </p>
      </div>
      <div>
        <div class="text-brand text-[15px] font-medium">Track interactions</div>
        <h3 class="font-semibold text-lg leading-8 mt-2">
          Easily track and manage complex media state
        </h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          Every player interaction triggers an event, and every event becomes part of a chain. This
          makes it possible to track events back to their origin, determine how they were triggered
          (system/user), and uncover anything that might've occurred along the way.
        </p>
      </div>
      <div>
        <div class="text-brand text-[15px] font-medium">Framework-agnostic</div>
        <h3 class="font-semibold text-lg leading-8 mt-2">No matter your stack - it will work</h3>
        <p class="max-w-[500px] mt-3 tracking-wide font-normal text-soft">
          There’s a plethora of frontend libraries and frameworks to choose from today. We strive to
          provide a smooth development experience regardless of which you choose. Vidstack Player
          integrates with React, Vue (coming soon), Svelte (coming soon), Tailwind CSS, and more.
        </p>
      </div>
    </div>
  </div>

  <Footer slot="after-main" />
</MainLayout>
