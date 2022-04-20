<script lang="ts">
  import { SocialLink } from '@svelteness/kit-docs';

  export let type: 'discord' | 'gitHub' | 'twitter';

  const href = {
    discord: 'https://discord.com/invite/7RGU7wvsu9',
    gitHub: 'https://github.com/vidstack',
    twitter: 'https://twitter.com/vidstackjs?lang=en',
  };
</script>

<SocialLink {type} href={href[type]} />
