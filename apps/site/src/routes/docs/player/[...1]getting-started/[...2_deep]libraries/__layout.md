# {$frontmatter.title}

In this section, you'll find an {lowercaseFirstLetter($frontmatter.description)}

<script>
  import { lowercaseFirstLetter } from '@vidstack/foundation';

  const libs = ['HTML', 'React', 'Svelte', 'Vue', 'Lit', 'Angular', 'Tailwind'];

  let links = libs
    .map(lib => ({ 
      title: lib, 
      href: `/docs/player/getting-started/libraries/${lib.toLowerCase()}` 
    }));
</script>

<TabbedLinks {links} />

<slot />
