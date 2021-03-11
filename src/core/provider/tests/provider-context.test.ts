import { elementUpdated, expect } from '@open-wc/testing';

import {
  isBoolean,
  isNumber,
  isString,
  isUndefined,
} from '../../../utils/unit';
import {
  buildFakeMediaProvider,
  buildFakeMediaProviderWithFakeConsumer,
} from '../../fakes/helpers';
import { playerContext } from '../../player.context';
import { PlayerContext } from '../../player.types';
import { ViewType } from '../../ViewType';

describe('provider context', () => {
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
      const newValue = genRandomNewValue(prop, provider.context[ctxProp]);

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
        provider.context[ctxProp] = newValue;
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

  it('should soft reset context', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.context.pausedCtx = false;
    provider.context.durationCtx = 200;
    await elementUpdated(consumer);

    ((provider as unknown) as { softResetContext(): void }).softResetContext();
    await elementUpdated(consumer);

    expect(consumer.paused, 'paused').to.equal(true);
    expect(consumer.duration, 'duration').to.equal(-1);
  });

  it.skip('should hard reset context when provider disconnects', async () => {
    const [provider, consumer] = await buildFakeMediaProviderWithFakeConsumer();

    provider.context.viewTypeCtx = ViewType.Video;
    await elementUpdated(consumer);

    provider.disconnectedCallback();
    await elementUpdated(consumer);

    expect(consumer.viewType, 'viewType').to.equal(ViewType.Unknown);
  });
});
