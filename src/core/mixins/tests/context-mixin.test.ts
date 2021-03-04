import '../../fakes/vds-fake-context-consumer';
import '../../fakes/vds-fake-media-provider';

import { elementUpdated, expect, oneEvent } from '@open-wc/testing';

import {
  isBoolean,
  isNumber,
  isString,
  isUndefined,
} from '../../../utils/unit';
import {
  buildFakeMediaProvider,
  buildFakeMediaProviderWithFakeConsumer,
  emitEvent,
} from '../../fakes/helpers';
import { playerContext } from '../../player.context';
import { DisconnectEvent, SrcChangeEvent } from '../../player.events';
import { PlayerContext, ViewType } from '../../player.types';

describe('context mixin', () => {
  it.skip('should have defined all context properties', async () => {
    const provider = await buildFakeMediaProvider();

    Object.keys(playerContext).forEach(prop => {
      const ctxProp = `${prop}Ctx`;
      const descriptor = Object.getOwnPropertyDescriptor(
        provider.constructor.prototype,
        ctxProp,
      );
      expect(
        descriptor?.get && descriptor?.set,
        `Expected context property [${ctxProp}] to be defined.`,
      ).to.exist;
    });
  });

  it('should update context consumer', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    function genRandomNewValue(prop: keyof PlayerContext, value: unknown) {
      if (isString(value) || prop === 'aspectRatio') {
        return Math.random().toString(36).substring(7);
      } else if (isNumber(value)) {
        return Math.random();
      } else if (isBoolean(value)) {
        return !value;
      }

      return undefined;
    }

    const promises = ((Object.keys(
      playerContext,
    ) as unknown) as (keyof PlayerContext)[]).map(async prop => {
      const ctxProp = `${prop}Ctx`;
      const newValue = genRandomNewValue(prop, provider.playerContext[ctxProp]);

      expect(
        newValue,
        `
            Failed to generate random value for context update [${prop}] 

            It might be because the value is \`undefined\` or a non-primitive value so the 
            type can't be automatically determined. Handle this outlier in the \`genRandomNewValue\` 
            function inside this test case.\n
          `,
      ).to.exist;

      if (!isUndefined(newValue)) {
        provider.playerContext[ctxProp] = newValue;
        await elementUpdated(consumer);
        expect(
          consumer[prop],
          `
              Context [${prop}] failed to update

              1. Check that you've included it correctly in \`player.context.ts\`
              2. Check that you've defined the provider correctly in \`ContextMixin.ts\`.
              3. Check that you've defined the consumer correctly in \`FakeConsumer.ts\`\n
            `,
        ).to.equal(newValue);
      }
    });

    await Promise.all(promises);
  });

  it('should soft reset context when media is changed', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.playerContext.pausedCtx = false;
    provider.playerContext.durationCtx = 200;
    await elementUpdated(consumer);

    emitEvent(provider, new SrcChangeEvent({ detail: '' }));
    await oneEvent(provider, SrcChangeEvent.TYPE);
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(consumer.duration, 'duration').to.equal(-1);
  });

  it('should hard reset context when provider disconnects', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.playerContext.viewTypeCtx = ViewType.Video;
    await elementUpdated(consumer);

    emitEvent(provider, new DisconnectEvent());
    await oneEvent(provider, DisconnectEvent.TYPE);
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
