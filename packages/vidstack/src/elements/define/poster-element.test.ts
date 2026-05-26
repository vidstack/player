import { MediaPlayerElement } from './player-element';
import { MediaPosterElement } from './poster-element';

describe('MediaPosterElement', () => {
  beforeAll(() => {
    stubBrowserAPIs();
    defineElement(MediaPlayerElement);
    defineElement(MediaPosterElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('forwards image loading attributes to the default image', async () => {
    const { poster } = setupPoster();

    poster.setAttribute('src', '/poster.png');
    poster.setAttribute('loading', 'lazy');
    poster.setAttribute('decoding', 'async');
    poster.setAttribute('fetchpriority', 'high');

    await waitForUpdates();

    const img = poster.querySelector('img');

    expect(img).toBeInstanceOf(HTMLImageElement);
    expect(img?.getAttribute('loading')).to.equal('lazy');
    expect(img?.getAttribute('decoding')).to.equal('async');
    expect(img?.getAttribute('fetchpriority')).to.equal('high');
  });

  it('uses an explicit image child instead of injecting a second image', async () => {
    const { poster } = setupPoster();
    const img = document.createElement('img');

    img.setAttribute('src', '/poster.png');
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    poster.append(img);

    await waitForUpdates();

    expect(poster.querySelectorAll('img')).to.have.length(1);
    expect(poster.firstElementChild).to.equal(img);
    expect(img.getAttribute('src')).to.equal('/poster.png');
    expect(img.getAttribute('loading')).to.equal('eager');
    expect(img.getAttribute('fetchpriority')).to.equal('high');
  });
});

function stubBrowserAPIs() {
  window.matchMedia ??= vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  globalThis.IntersectionObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

function defineElement(element: CustomElementConstructor & { tagName: string }) {
  if (!customElements.get(element.tagName)) {
    customElements.define(element.tagName, element);
  }
}

function setupPoster() {
  const player = document.createElement('media-player'),
    poster = document.createElement('media-poster');

  player.append(poster);
  document.body.append(player);

  return { player, poster };
}

async function waitForUpdates() {
  await Promise.resolve();
  await new Promise<void>((resolve) => setTimeout(resolve));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
