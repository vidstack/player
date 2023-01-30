import { RequestQueue } from './request-queue';

it('should return correct queue size', () => {
  const q = new RequestQueue();

  q._enqueue('a', () => {});
  q._enqueue('b', () => {});

  expect(q._size).to.equal(2);
});

it('should serve items in queue', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();

  await q._serve('a');
  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).not.toHaveBeenCalled();
  expect(q._size).to.equal(1);

  await q._serve('b');
  expect(itemB).toHaveBeenCalledOnce();
  expect(q._size).to.equal(0);
});

it('should flush queue in-order', async () => {
  const q = new RequestQueue();

  let timestampA, timestampB, timestampC;

  const itemA = () => {
    timestampA = process.hrtime();
  };
  const itemB = () => {
    timestampB = process.hrtime();
  };
  const itemC = () => {
    timestampC = process.hrtime();
  };

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);
  q._enqueue('c', itemC);

  q._start();

  expect(timestampA < timestampB && timestampA < timestampC).to.be.true;
  expect(timestampB < timestampC).to.be.true;
});

it('should flush pending requests on start', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);

  q._start();

  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).toHaveBeenCalledOnce();
});

it('should serve immediately once started', async () => {
  const q = new RequestQueue();

  q._start();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);

  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).toHaveBeenCalledOnce();
});

it('should not serve immediately once stopped', async () => {
  const q = new RequestQueue();

  q._start();
  q._stop();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();
});

it('should release pending flush when started', async () => {
  const q = new RequestQueue();

  setTimeout(() => {
    q._start();
  });

  await q._waitForFlush();
});

it('should release pending flush when destroyed', async () => {
  const q = new RequestQueue();

  setTimeout(() => {
    q._reset();
  });

  await q._waitForFlush();
});

it('should clear queue when destroyed', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q._enqueue('a', itemA);
  q._enqueue('b', itemB);

  await q._reset();

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();
  expect(q._size).to.equal(0);
});
