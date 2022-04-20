<script>
  import Footer from '$lib/layout/Footer.svelte';

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

<HeroSection />
<HowSection />
<OpenSourceSection />

<Footer />
