import { RequestQueue } from '$lib';

it('should return correct queue size', () => {
  const q = new RequestQueue();

  q.queue('a', () => {});
  q.queue('b', () => {});

  expect(q.size).to.equal(2);
});

it('should serve items in queue', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q.queue('a', itemA);
  q.queue('b', itemB);

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();

  await q.serve('a');
  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).not.toHaveBeenCalled();
  expect(q.size).to.equal(1);

  await q.serve('b');
  expect(itemB).toHaveBeenCalledOnce();
  expect(q.size).to.equal(0);
});

it('should flush pending requests on start', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q.queue('a', itemA);
  q.queue('b', itemB);

  await q.start();

  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).toHaveBeenCalledOnce();
});

it('should serve immediately once started', async () => {
  const q = new RequestQueue();

  await q.start();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q.queue('a', itemA);
  q.queue('b', itemB);

  expect(itemA).toHaveBeenCalledOnce();
  expect(itemB).toHaveBeenCalledOnce();
});

it('should not serve immediately once stopped', async () => {
  const q = new RequestQueue();

  await q.start();
  await q.stop();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q.queue('a', itemA);
  q.queue('b', itemB);

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();
});

it('should release pending flush when started', async () => {
  const q = new RequestQueue();

  setTimeout(() => {
    q.start();
  });

  await q.waitForFlush();
});

it('should release pending flush when destroyed', async () => {
  const q = new RequestQueue();

  setTimeout(() => {
    q.destroy();
  });

  await q.waitForFlush();
});

it('should clear queue when destroyed', async () => {
  const q = new RequestQueue();

  const itemA = vi.fn();
  const itemB = vi.fn();

  q.queue('a', itemA);
  q.queue('b', itemB);

  await q.destroy();

  expect(itemA).not.toHaveBeenCalled();
  expect(itemB).not.toHaveBeenCalled();
  expect(q.size).to.equal(0);
});
