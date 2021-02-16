import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import { spy } from 'sinon';
import { isNil } from '../../utils';
import { BootEndEvent } from '../events';
import { Player } from '../Player';
import { Bootable, BootStrategy, ImmediateBootStrategy } from '../strategies';
import '../vds-player';

describe('boot', () => {
  it('should use immediate boot strategy', async () => {
    const player = await fixture<Player>(
      '<vds-player boot-strategy="immediate"></vds-player>',
    );
    await oneEvent(player, BootEndEvent.TYPE);
    expect(player).to.have.attribute('booted', 'true');
    expect(player.hasBooted).to.be.true;
  });

  it('should use click boot strategy', async () => {
    const player = await fixture<Player>(
      '<vds-player boot-strategy="click"></vds-player>',
    );
    expect(player).to.have.attribute('booted', 'false');
    expect(player.hasBooted).to.be.false;
    player.dispatchEvent(new MouseEvent('click'));
    await oneEvent(player, BootEndEvent.TYPE);
    expect(player.hasBooted).to.be.true;
    expect(player).to.have.attribute('booted', 'true');
  });

  it('should use lazy boot strategy', async () => {
    const player = await fixture<Player>(
      '<vds-player boot-strategy="lazy" style="margin-top: 10000px;"></vds-player>',
    );
    expect(player).to.have.attribute('booted', 'false');
    expect(player.hasBooted).to.be.false;
    player.style.marginTop = `0px`;
    await oneEvent(player, BootEndEvent.TYPE);
    expect(player).to.have.attribute('booted', 'true');
    expect(player.hasBooted).to.be.true;
  });

  it('should use custom boot strategy', async () => {
    class CustomStrategy implements BootStrategy {
      async register(bootable: Bootable) {
        bootable.boot();
      }

      destroy() {
        // ...
      }
    }

    const player = await fixture<Player>(
      `<vds-player boot-strategy="click"></vds-player>`,
    );
    player.bootStrategy = new CustomStrategy();
    await oneEvent(player, BootEndEvent.TYPE);
    expect(player).to.have.attribute('booted', 'true');
    expect(player.hasBooted).to.be.true;
  });

  it('should render booting slot', async () => {
    const player = await fixture<Player>(`
      <vds-player boot-strategy="click">
        <div slot="booting">Koala</div>
      </vds-player>
    `);

    const slot = player.shadowRoot?.querySelector('slot');
    const childNodes = slot?.assignedNodes({ flatten: true });
    expect(childNodes?.[0]).to.equal(
      player.querySelector('div[slot="booting"]'),
    );

    player.dispatchEvent(new MouseEvent('click'));
    await oneEvent(player, BootEndEvent.TYPE);
    const newChildNodes = slot?.assignedNodes({ flatten: true });
    expect(newChildNodes).to.be.empty;
  });

  it('should render strategy-specific boot screen', async () => {
    class CustomStrategy extends ImmediateBootStrategy {
      async register() {
        // ...
      }

      renderWhileBooting() {
        return html`<span title="kangaroo"></span>`;
      }
    }

    const player = await fixture<Player>(`
      <vds-player boot-strategy="click">
        <div slot="booting">Koala</div>
      </vds-player>
    `);

    player.bootStrategy = new CustomStrategy();

    await waitUntil(
      () => !isNil(player.shadowRoot?.querySelector('span[title="kangaroo"]')),
      'Player did not render strategy-specific boot screen',
    );
  });

  it('should cleanup previous boot strategy', async () => {
    const destroySpy = spy();

    class CustomStrategy extends ImmediateBootStrategy {
      async register() {
        // ...
      }

      destroy() {
        destroySpy();
      }
    }

    const player = await fixture<Player>(
      `<vds-player boot-strategy="click"></vds-player>`,
    );
    player.bootStrategy = new CustomStrategy();
    await elementUpdated(player);
    player.setAttribute('boot-strategy', 'immediate');
    await elementUpdated(player);
    expect(destroySpy).to.have.been.calledOnce;
  });

  it('should cleanup boot process', async () => {
    const player = await fixture<Player>(
      `<vds-player boot-strategy="immediate"></vds-player>`,
    );
    player.bootStrategy.destroy = spy();
    player.disconnectedCallback();
    expect(player.bootStrategy.destroy).to.have.been.calledOnce;
    expect(player.hasBooted).to.be.false;
    expect(player).to.not.have.attribute('booted', 'true');
  });
});
