<script>
  import MainLayout from '$src/layouts/MainLayout.svelte';
  import HeroSection from '$src/pages/index/HeroSection.svelte';
  import Player from '$src/pages/index/Player.svelte';
  import Footer from '$src/layouts/Footer.svelte';

  const title = 'Vidstack - Frontend video tools to build awesome media experiences on the web.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="twitter:title" content={title} />
  <meta property="og:title" content={title} />
</svelte:head>

<MainLayout --navbar-border-bottom="none" --main-padding-x="none" --main-overflow-x="hidden">
  <HeroSection />
  <div class="768:px-0 mx-auto mt-20 max-w-4xl px-2">
    <Player />
  </div>
  <Footer slot="after-main" />
</MainLayout>
