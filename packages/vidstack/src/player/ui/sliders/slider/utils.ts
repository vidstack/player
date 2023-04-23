import { clampNumber, getNumberOfDecimalPlaces, round } from '../../../../utils/number';

export function getClampedValue(min: number, max: number, value: number, step: number) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}

export function getValueFromRate(min: number, max: number, rate: number, step: number) {
  const boundRate = clampNumber(0, rate, 1);
  const range = max - min;
  const fill = range * boundRate;
  const stepRatio = Math.round(fill / step);
  const steps = step * stepRatio;
  return min + steps;
}
