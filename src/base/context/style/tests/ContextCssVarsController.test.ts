import { expect } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { mediaContext } from '../../../../media';
import { buildMediaPlayerFixture } from '../../../../media/test-utils';
import { ContextCssVarsController } from '../ContextCssVarsController';

class ReferenceElement extends LitElement {
  controller = new ContextCssVarsController(this);
}

window.customElements.define('ref-element', ReferenceElement);

describe(ContextCssVarsController.name, function () {
  async function buildFixture() {
    const { player } = await buildMediaPlayerFixture(html`
      <ref-element></ref-element>
    `);

    const ref = player.querySelector('ref-element') as ReferenceElement;

    return { player, ref };
  }

  it('should update css var given boolean context', async function () {
    const { player, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused');
    expect(ref.style.getPropertyValue('--paused')).to.equal('true');

    player.ctx.paused = false;
    expect(ref.style.getPropertyValue('--paused')).to.equal('false');

    ref.remove();
    expect(ref.style.getPropertyValue('--paused')).to.equal('true');
  });

  it('should update css var given number context', async function () {
    const { player, ref } = await buildFixture();

    ref.controller.bind(mediaContext.currentTime, 'current-time');
    expect(ref.style.getPropertyValue('--current-time')).to.equal('0');

    player.ctx.currentTime = NaN;
    expect(ref.style.getPropertyValue('--current-time')).to.equal('0');

    player.ctx.currentTime = 50;
    expect(ref.style.getPropertyValue('--current-time')).to.equal('50');

    ref.remove();
    expect(ref.style.getPropertyValue('--current-time')).to.equal('0');
  });

  it('shoud update css var given string context', async function () {
    const { player, ref } = await buildFixture();

    ref.controller.bind(mediaContext.currentSrc, 'current-src');
    expect(ref.style.getPropertyValue('--current-src')).to.equal('');

    player.ctx.currentSrc = 'apples';
    expect(ref.style.getPropertyValue('--current-src')).to.equal('apples');

    ref.remove();
    expect(ref.style.getPropertyValue('--current-src')).to.equal('');
  });

  it('should update css var given object context', async function () {
    const { ref } = await buildFixture();
    ref.controller.bind(mediaContext.buffered, 'buffered');
    expect(ref.style.getPropertyValue('--buffered')).to.equal(
      '[object Object]'
    );
    ref.remove();
    expect(ref.style.getPropertyValue('--current-src')).to.equal('');
  });

  it('should bind multiple contexts to css vars', async function () {
    const { player, ref } = await buildFixture();

    ref.controller
      .bind(mediaContext.paused, 'paused')
      .bind(mediaContext.canPlay, 'can-play');

    expect(ref.style.getPropertyValue('--paused')).to.equal('true');
    expect(ref.style.getPropertyValue('--can-play')).to.equal('false');

    player.ctx.canPlay = true;

    expect(ref.style.getPropertyValue('--paused')).to.equal('true');
    expect(ref.style.getPropertyValue('--can-play')).to.equal('true');

    player.ctx.paused = false;

    expect(ref.style.getPropertyValue('--paused')).to.equal('false');
    expect(ref.style.getPropertyValue('--can-play')).to.equal('true');
  });

  it('should use custom transformer', async function () {
    const { player, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused', (p) => !p);
    expect(ref.style.getPropertyValue('--paused')).to.equal('false');

    player.ctx.paused = false;
    expect(ref.style.getPropertyValue('--paused')).to.equal('true');

    ref.remove();
    expect(ref.style.getPropertyValue('--paused')).to.equal('false');
  });

  it('should unbind context', async function () {
    const { player, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused');
    expect(ref.style.getPropertyValue('--paused')).to.equal('true');

    ref.controller.unbind(mediaContext.paused);
    expect(ref.style.getPropertyValue('--paused')).to.equal('');

    player.ctx.paused = false;
    player.ctx.paused = true;
    expect(ref.style.getPropertyValue('--paused')).to.equal('');
  });
});
