import { LogLevelColor, LogLevelValue } from '$lib';

it('should return correct log level value', () => {
  expect(LogLevelValue['silent']).to.equal(0);
  expect(LogLevelValue['error']).to.equal(1);
  expect(LogLevelValue['warn']).to.equal(2);
  expect(LogLevelValue['info']).to.equal(3);
  expect(LogLevelValue['debug']).to.equal(4);
});

it('should return correct log level color', () => {
  expect(LogLevelColor['silent']).to.equal('white');
  expect(LogLevelColor['error']).to.equal('hsl(6, 58%, 50%)');
  expect(LogLevelColor['warn']).to.equal('hsl(51, 58%, 50%)');
  expect(LogLevelColor['info']).to.equal('hsl(219, 58%, 50%)');
  expect(LogLevelColor['debug']).to.equal('hsl(280, 58%, 50%)');
});
