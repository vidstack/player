import { expect, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import { Bootable, BootStrategy } from '../BootStrategy';
import { BootStrategyFactory } from '../BootStrategyFactory';
import { ClickBootStrategy } from '../ClickBootStrategy';
import { ImmediateBootStrategy } from '../ImmediateBootStrategy';
import { LazyBootStrategy } from '../LazyBootStrategy';

describe('immediate boot strategy', () => {
  it('should boot', () => {
    const bootable: Bootable = {
      bootTarget: document.createElement('div'),
      boot: spy(),
    };

    new ImmediateBootStrategy().register(bootable);

    expect(bootable.boot).to.have.been.calledOnce;
  });
});

describe('click boot strategy', () => {
  it('should boot', () => {
    const bootable: Bootable = {
      bootTarget: document.createElement('div'),
      boot: spy(),
    };

    new ClickBootStrategy().register(bootable);
    expect(bootable.boot).to.not.have.been.called;

    bootable.bootTarget.dispatchEvent(new MouseEvent('click'));
    expect(bootable.boot).to.have.been.calledOnce;

    // Ensure event listener is removed.
    bootable.bootTarget.dispatchEvent(new MouseEvent('click'));
    expect(bootable.boot).to.have.been.calledOnce;
  });
});

describe('lazy boot strategy', () => {
  it('should boot', async () => {
    const el = await fixture<HTMLDivElement>(
      html`<div style="margin-top: 10000px;"></div>`,
    );

    const bootable: Bootable = {
      bootTarget: el,
      boot: spy(),
    };

    new LazyBootStrategy().register(bootable);
    expect(bootable.boot).to.not.have.been.called;

    // Bring it in view.
    el.style.marginTop = `0px`;
    setTimeout(() => {
      expect(bootable.boot).to.have.been.calledOnce;
    });
  });
});

describe('boot strategy factory', () => {
  it('should build from constructor', () => {
    class CustomStrategy implements BootStrategy {
      async register() {
        // ...
      }

      destroy() {
        // ...
      }
    }

    const strategy = BootStrategyFactory.build(CustomStrategy);
    expect(strategy).to.instanceOf(CustomStrategy);
  });

  it('should build immediate strategy', () => {
    const strategy = BootStrategyFactory.build('immediate');
    expect(strategy).to.instanceOf(ImmediateBootStrategy);
  });

  it('should build click strategy', () => {
    const strategy = BootStrategyFactory.build('click');
    expect(strategy).to.instanceOf(ClickBootStrategy);
  });

  it('should build lazy strategy', () => {
    const strategy = BootStrategyFactory.build('lazy');
    expect(strategy).to.instanceOf(LazyBootStrategy);
  });
});
