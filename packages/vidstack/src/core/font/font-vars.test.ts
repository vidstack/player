import { vi } from 'vitest';

let player: { el: HTMLElement };

describe('font vars', function () {
  beforeEach(function () {
    vi.resetModules();
    vi.doMock('../api/media-context', () => ({
      useMediaContext: () => ({ player }),
    }));

    localStorage.clear();
  });

  afterEach(function () {
    vi.doUnmock('../api/media-context');
  });

  it('applies stored font vars to players added after the watcher is initialized', async function () {
    localStorage.setItem('vds-player:font-family', 'capitals');
    localStorage.setItem('vds-player:text-bg', '#ff0000');
    localStorage.setItem('vds-player:text-bg-opacity', '50%');

    const [{ createScope, scoped }, { updateFontCssVars }] = await Promise.all([
      import('maverick.js'),
      import('./font-vars'),
    ]);

    player = { el: document.createElement('media-player') };
    scoped(() => updateFontCssVars(), createScope());

    player = { el: document.createElement('media-player') };
    scoped(() => updateFontCssVars(), createScope());

    expect(player.el.style.getPropertyValue('--media-user-text-bg').replace(/\s+/g, ' ')).to.equal(
      'rgb(255 0 0 / var(--media-user-text-bg-opacity, 1))',
    );
    expect(player.el.style.getPropertyValue('--media-user-text-bg-opacity')).to.equal('0.5');
    expect(player.el.style.getPropertyValue('--media-user-font-variant')).to.equal('small-caps');
  });
});
