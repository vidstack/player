<script lang="ts">
  import SocialLink from '$src/components/social/SocialLink.svelte';
</script>

<footer
  class="border-t flex flex-col font-medium bg-gray-100 border-gray-200 mt-20 text-center text-base w-full py-12 items-center justify-center 992:mt-32 dark:bg-gray-700 dark:border-gray-600"
>
  <div class="flex flex-row space-x-8">
    <SocialLink type="twitter" />
    <SocialLink type="discord" />
    <SocialLink type="gitHub" />
  </div>

  <span class="mt-8 text-gray-soft">
    © Vidstack {new Date().getFullYear()}
  </span>
</footer>
