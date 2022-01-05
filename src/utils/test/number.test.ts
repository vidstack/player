import { clampNumber, getNumberOfDecimalPlaces, round } from '../number';

describe(round.name, function () {
  test('it should round to given number of decimal places', () => {
    expect(round(1.256, 1)).toEqual(1.3);
    expect(round(1.2567, 2)).toEqual(1.26);
    expect(round(1.2563, 3)).toEqual(1.256);
  });
});

describe(clampNumber.name, function () {
  test('it should clamp number', () => {
    expect(clampNumber(0, 0.5, 1)).toEqual(0.5);
    expect(clampNumber(10, -5, 20)).toEqual(10);
    expect(clampNumber(10, 50, 30)).toEqual(30);
  });
});

describe(getNumberOfDecimalPlaces.name, function () {
  test('it should get number of decimal places', () => {
    expect(getNumberOfDecimalPlaces(1.2)).toEqual(1);
    expect(getNumberOfDecimalPlaces(2.56)).toEqual(2);
    expect(getNumberOfDecimalPlaces(40.567)).toEqual(3);
    expect(getNumberOfDecimalPlaces(100.56789)).toEqual(5);
  });
});
