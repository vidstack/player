<script>
  import MetaTags from '$src/components/base/MetaTags.svelte';
  import MainLayout from '$src/layouts/MainLayout.svelte';
  import HeroSection from '$src/pages/index/HeroSection.svelte';
  import Player from '$src/pages/index/Player.svelte';
  import Footer from '$src/layouts/Footer.svelte';
</script>

<MetaTags
  title="Vidstack: Where people build awesome media experiences"
  description="Vidstack makes it easier to work with video & audio on the web."
/>

<MainLayout --navbar-border-bottom="none" --main-padding-x="none" --main-overflow-x="hidden">
  <HeroSection />
  <div class="768:px-0 mx-auto mt-20 max-w-4xl px-2">
    <Player />
  </div>
  <Footer slot="after-main" />
</MainLayout>
