import { isVdsEvent, VdsEvent, vdsEvent } from '../VdsEvent';

describe(vdsEvent.name, () => {
  test('it should create VdsEvent', () => {
    const event = vdsEvent('vds-play', { bubbles: true, composed: true });
    expect(event).to.be.instanceOf(VdsEvent);
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });
});

describe(VdsEvent.name, () => {
  test('it should return self given no original event', () => {
    const event = new VdsEvent('vds-event');
    expect(event.originEvent).to.equal(event);
    expect(event.isOriginTrusted).to.equal(false);
  });

  test('it should return origin event', () => {
    const originEvent = new MouseEvent('click');

    const event = new VdsEvent('vds-event', {
      triggerEvent: new VdsEvent('vds-event', { triggerEvent: originEvent })
    });

    expect(event.originEvent).to.equal(originEvent);
    expect(event.isOriginTrusted).to.equal(false);
  });
});

describe(isVdsEvent.name, () => {
  test('it should return true given a VdsEvent', function () {
    expect(isVdsEvent(new VdsEvent('vds-event'))).to.be.true;
  });

  test('it should return false given an event not an instance of VdsEvent', function () {
    expect(isVdsEvent(new MouseEvent('click'))).to.be.false;
  });
});
