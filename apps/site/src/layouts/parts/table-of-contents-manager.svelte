<script lang="ts">
  import { onMount } from 'svelte';

  import { DisposalBin, listenEvent, onPress } from '../../utils/events';
  import { throttleAndDebounce } from '../../utils/timing';

  let scrollOffset: number;

  function update(links: HTMLAnchorElement[], active: number) {
    for (let i = 0; i < links.length; i++) {
      links[i].toggleAttribute('data-active', i === active);
    }
  }

  function getLinks() {
    return [...document.querySelectorAll(`#table-of-contents a`)] as HTMLAnchorElement[];
  }

  function onScroll() {
    scrollOffset = document.querySelector('main')!.offsetTop;

    const links = getLinks(),
      anchors = [...document.querySelectorAll<HTMLAnchorElement>('.anchor-link')].filter((anchor) =>
        links.some((link) => {
          return link.hash === anchor.hash;
        }),
      );

    const scrollY = window.scrollY,
      innerHeight = window.innerHeight,
      offsetHeight = document.body.offsetHeight,
      isTop = scrollY < scrollOffset,
      isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

    if (isTop) {
      update(links, -1);
      return;
    }

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      update(links, anchors.length - 1);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i],
        nextAnchor = anchors[i + 1],
        hash = isAnchorActive(i, anchor, nextAnchor);

      if (hash) {
        update(links, i);
        return;
      }
    }
  }

  function getAnchorTop(anchor: HTMLAnchorElement): number {
    const rect = anchor.getBoundingClientRect();
    return rect.top + window.scrollY - scrollOffset - rect.height / 2;
  }

  function isAnchorActive(
    index: number,
    anchor: HTMLAnchorElement,
    nextAnchor: HTMLAnchorElement | undefined,
  ): string | null {
    const scrollTop = window.scrollY;
    if (index === 0 && scrollTop === 0) return null;
    if (scrollTop < getAnchorTop(anchor)) return null;
    if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) return anchor.hash;
    return null;
  }

  onMount(() => {
    const disposal = new DisposalBin(),
      links = getLinks();

    for (let i = 0; i < links.length; i++) {
      disposal.add(
        onPress(links[i], () => {
          update(getLinks(), i);
        }),
      );
    }

    onScroll();
    disposal.add(
      listenEvent(
        window,
        'scroll',
        throttleAndDebounce(() => onScroll(), 100),
      ),
    );

    return () => disposal.dispose();
  });
</script>
