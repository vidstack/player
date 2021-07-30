import { expect } from '@open-wc/testing';
import { html, LitElement } from 'lit';

import { mediaContext } from '../../../../media';
import { buildMediaFixture } from '../../../../media/test-utils';
import { ContextAttrsController } from '../ContextAttrsController';

class ReferenceElement extends LitElement {
  controller = new ContextAttrsController(this);
}

window.customElements.define('ref-element', ReferenceElement);

describe(ContextAttrsController.name, function () {
  async function buildFixture() {
    const { controller } = await buildMediaFixture(html`
      <ref-element></ref-element>
    `);

    const ref = controller.querySelector('ref-element') as ReferenceElement;

    return { controller, ref };
  }

  it('should update attribute given boolean context', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused');
    expect(ref).to.have.attribute('paused');

    controller.ctx.paused = false;
    expect(ref).to.not.have.attribute('paused');

    ref.remove();
    expect(ref).to.have.attribute('paused');
  });

  it('should update attribute given number context', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller.bind(mediaContext.currentTime, 'current-time');
    expect(ref).to.have.attribute('current-time', '0');

    controller.ctx.currentTime = NaN;
    expect(ref).to.have.attribute('current-time', '0');

    controller.ctx.currentTime = 50;
    expect(ref).to.have.attribute('current-time', '50');

    ref.remove();
    expect(ref).to.have.attribute('current-time', '0');
  });

  it('shoud update attribute given string context', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller.bind(mediaContext.currentSrc, 'current-src');
    expect(ref).to.have.attribute('current-src', '');

    controller.ctx.currentSrc = 'apples';
    expect(ref).to.have.attribute('current-src', 'apples');

    ref.remove();
    expect(ref).to.have.attribute('current-src', '');
  });

  it('should update attribute given object context', async function () {
    const { controller, ref } = await buildFixture();
    ref.controller.bind(mediaContext.buffered, 'buffered');
    expect(ref).to.have.attribute('buffered', '[object Object]');
    ref.remove();
    expect(ref).to.not.have.attribute('buffered');
  });

  it('should bind multiple contexts to attributes', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller
      .bind(mediaContext.paused, 'paused')
      .bind(mediaContext.canPlay, 'can-play');

    expect(ref).to.have.attribute('paused', '');
    expect(ref).to.not.have.attribute('can-play', '');

    controller.ctx.canPlay = true;

    expect(ref).to.have.attribute('paused', '');
    expect(ref).to.have.attribute('can-play', '');

    controller.ctx.paused = false;

    expect(ref).to.not.have.attribute('paused', '');
    expect(ref).to.have.attribute('can-play', '');
  });

  it('should use custom transformer', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused', (p) => !p);
    expect(ref).to.not.have.attribute('paused');

    controller.ctx.paused = false;
    expect(ref).to.have.attribute('paused', 'true');

    ref.remove();
    expect(ref).to.not.have.attribute('paused');
  });

  it('should unbind context', async function () {
    const { controller, ref } = await buildFixture();

    ref.controller.bind(mediaContext.paused, 'paused');
    expect(ref).to.have.attribute('paused', '');

    ref.controller.unbind(mediaContext.paused);
    expect(ref).to.not.have.attribute('paused');

    controller.ctx.paused = false;
    controller.ctx.paused = true;
    expect(ref).to.not.have.attribute('paused');
  });
});
