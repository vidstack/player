<script>
  import SocialLink from '$lib/components/social/SocialLink.svelte';
</script>

<section
  class="flex flex-col items-center justify-center px-4 768:px-12 mt-32 768:mt-48 mb-16 768:mb-28"
>
  <h2
    class="font-bold 768:text-5xl text-center 768:leading-[3.5rem] text-4xl leading-[2.6rem] flex items-center"
  >
    <span class="text-transparent bg-gradient-to-r from-brand to-[#FB7185] bg-clip-text">
      Join our growing community
    </span>
  </h2>
  <p class="text-soft text-lg max-w-2xl text-center mt-6">
    A community built for frontend devs who are working with audio and video. Join in on the
    discussions, share your designs and knowledge, ask for help, and connect with other devs
    building awesome media experiences.
  </p>
  <div class="flex space-x-6 mt-8">
    <SocialLink width={40} height={40} type="gitHub" />
    <SocialLink width={40} height={40} type="twitter" />
    <SocialLink width={40} height={40} type="discord" />
  </div>
</section>
