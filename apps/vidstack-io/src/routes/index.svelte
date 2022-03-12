<script>
  import Navbar from '$components/layout/navbar/Navbar.svelte';
  import Footer from '$components/layout/Footer.svelte';

  import HeroSection from './_components/_HeroSection.svelte';
  import OpenSourceSection from './_components/_OpenSourceSection.svelte';
  import HowSection from './_components/_HowSection.svelte';

  const title = 'Vidstack - Frontend video tools to build awesome media experiences on the web.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="twitter:title" content={title} />
  <meta property="og:title" content={title} />
</svelte:head>

<Navbar contain />

<main class="z-0 flex min-w-full flex-col items-center pt-16 768:items-start">
  <HeroSection />
  <HowSection />
  <OpenSourceSection />
</main>

<Footer />
