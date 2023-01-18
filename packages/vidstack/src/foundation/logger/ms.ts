import { round } from '../../utils/number';

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;

/**
 * @see https://github.com/vercel/ms
 */
export function ms(val: number): string {
  const msAbs = Math.abs(val);

  if (msAbs >= d) {
    return Math.round(val / d) + 'd';
  }

  if (msAbs >= h) {
    return Math.round(val / h) + 'h';
  }

  if (msAbs >= m) {
    return Math.round(val / m) + 'm';
  }

  if (msAbs >= s) {
    return Math.round(val / s) + 's';
  }

  return round(val, 2) + 'ms';
}
