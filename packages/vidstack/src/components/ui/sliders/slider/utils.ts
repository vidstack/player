import { clampNumber, getNumberOfDecimalPlaces, round } from '../../../../utils/number';

export function getClampedValue(min: number, max: number, value: number, step: number) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}

export function getValueFromRate(min: number, max: number, rate: number, step: number) {
  const boundRate = clampNumber(0, rate, 1),
    range = max - min,
    fill = range * boundRate,
    stepRatio = fill / step,
    steps = step * Math.round(stepRatio);
  return min + steps;
}
