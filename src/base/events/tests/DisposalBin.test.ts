import { DisposalBin } from '../DisposalBin';

test('should empty bin', function () {
  const disposal = new DisposalBin();

  let calls = 0;

  const cleanup = () => {
    calls += 1;
  };

  disposal.add(cleanup);
  disposal.add(cleanup);

  disposal.empty();

  expect(calls).to.equal(2);
});
