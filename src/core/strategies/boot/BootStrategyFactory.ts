import { Constructor } from '../../../shared/types';
import { isString } from '../../../utils/unit';
import { BootStrategy } from './BootStrategy';
import { ClickBootStrategy } from './ClickBootStrategy';
import { ImmediateBootStrategy } from './ImmediateBootStrategy';
import { LazyBootStrategy } from './LazyBootStrategy';

export type BootStrategyType =
  | 'immediate'
  | 'click'
  | 'lazy'
  | Constructor<BootStrategy>;

const validStrategyType = new Set(['immediate', 'click', 'lazy']);

export class BootStrategyFactory {
  static isValidType(
    strategyType: string,
  ): strategyType is 'immediate' | 'click' | 'lazy' {
    return validStrategyType.has(strategyType);
  }

  static build(strategyType: BootStrategyType): BootStrategy {
    if (!isString(strategyType)) {
      return new strategyType();
    }

    if (strategyType === 'immediate') {
      return BootStrategyFactory.buildImmediateBootStrategy();
    } else if (strategyType === 'click') {
      return BootStrategyFactory.buildClickBootStrategy();
    }

    return BootStrategyFactory.buildLazyBootStrategy();
  }

  static buildImmediateBootStrategy(): ImmediateBootStrategy {
    return new ImmediateBootStrategy();
  }

  static buildClickBootStrategy(): ClickBootStrategy {
    return new ClickBootStrategy();
  }

  static buildLazyBootStrategy(): LazyBootStrategy {
    return new LazyBootStrategy();
  }
}
