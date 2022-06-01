<script>
  import MainLayout from '$src/layouts/MainLayout.svelte';
  import HeroSection from '$src/pages/index/HeroSection.svelte';
  import HowSection from '$src/pages/index/HowSection.svelte';
  import OpenSourceSection from '$src/pages/index/OpenSourceSection.svelte';
  import Footer from '$src/layouts/Footer.svelte';

  const title = 'Vidstack - Frontend video tools to build awesome media experiences on the web.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="twitter:title" content={title} />
  <meta property="og:title" content={title} />
</svelte:head>

<MainLayout --navbar-border-bottom="none" --main-padding-x="none">
  <HeroSection />
  <HowSection />
  <OpenSourceSection />
  <Footer />
</MainLayout>
