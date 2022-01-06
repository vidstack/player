import { ms } from '../ms';

test('it should format ms correctly', () => {
  expect(ms(0)).to.equal('0ms');
  expect(ms(1000 * 60)).to.equal('1m');
  expect(ms(1000 * 60 * 2)).to.equal('2m');
  expect(ms(1000 * 60 * 60)).to.equal('1h');
  expect(ms(1000 * 60 * 120)).to.equal('2h');
  expect(ms(1000 * 60 * 60 * 24)).to.equal('1d');
  expect(ms(1000 * 60 * 60 * 24 * 7)).to.equal('7d');
  expect(ms(1000 * 60 * 60 * 24 * 7 * 2)).to.equal('14d');
});
