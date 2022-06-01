import { route } from '@vitebook/svelte';
import { getContext, setContext, SvelteComponent } from 'svelte';
import { derived, type Readable } from 'svelte/store';

export type SidebarLink = {
  title: string;
  slug: string;
  icon?: { before?: typeof SvelteComponent; after?: typeof SvelteComponent };
};

export type SidebarLinks = {
  [category: string]: SidebarLink[];
};

export function isActiveSidebarLink({ slug }: SidebarLink, currentPath: string) {
  return currentPath.startsWith(slug);
}

export type SidebarContext = {
  links: Readable<SidebarLinks>;
  allLinks: Readable<SidebarLink[]>;
  activeLinkIndex: Readable<number>;
  activeLink: Readable<SidebarLink | null>;
  previousLink: Readable<SidebarLink | null>;
  nextLink: Readable<SidebarLink | null>;
  activeCategory: Readable<string | null>;
};

export function createSidebarContext(links: Readable<SidebarLinks>): SidebarContext {
  const allLinks = derived(links, ($links) => Object.values($links).flat());

  const activeLinkIndex = derived([allLinks, route], ([$allLinks, $route]) =>
    $allLinks.findIndex((link) => isActiveSidebarLink(link, $route.url.pathname)),
  );

  const activeLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex],
  );

  const previousLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex - 1],
  );

  const nextLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex + 1],
  );

  const activeCategory = derived([links, activeLink], ([$links, $activeLink]) => {
    const category =
      Object.keys($links).find((category) =>
        $links[category]?.some(
          (link) => link.title === $activeLink?.title && link.slug === $activeLink?.slug,
        ),
      ) ?? null;

    return category !== '.' ? category : null;
  });

  const context: SidebarContext = {
    links,
    allLinks,
    activeLinkIndex,
    activeLink,
    previousLink,
    nextLink,
    activeCategory,
  };

  return context;
}

const CTX_KEY = Symbol();

export function setSidebarContext(context: SidebarContext) {
  setContext(CTX_KEY, context);
}

export function getSidebarContext(): SidebarContext {
  return getContext(CTX_KEY);
}
