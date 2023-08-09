import { tick } from 'maverick.js';
import { mediaState } from '.';
import { PlayerQueryList } from './query-list';

it('should evaluate equals', () => {
  const state = mediaState.create(),
    queryList = new PlayerQueryList(state, '(width: 300)'),
    callback = vi.fn();

  queryList.addEventListener('change', callback);
  expect(queryList.matches).toBeFalsy();
  expect(callback).toBeCalledTimes(0);

  state.width.set(300);
  tick();
  expect(queryList.matches).toBeTruthy();
  expect(callback).toBeCalledTimes(1);

  queryList.destroy();
});

it('should evaluate comparison', () => {
  const state = mediaState.create(),
    queryList = new PlayerQueryList(state, '(width >= 680)');

  expect(queryList.matches).toBeFalsy();

  state.width.set(300);
  expect(queryList.matches).toBeFalsy();

  state.width.set(681);
  expect(queryList.matches).toBeTruthy();

  queryList.destroy();
});

it('should evaluate and', () => {
  const state = mediaState.create(),
    queryList = new PlayerQueryList(state, '(width < 400) and (orientation: "portrait")');

  expect(queryList.matches).toBeFalsy();

  state.width.set(300);
  expect(queryList.matches).toBeFalsy();

  state.orientation.set('portrait');
  expect(queryList.matches).toBeTruthy();

  queryList.destroy();
});

it('should evaluate or', () => {
  const state = mediaState.create(),
    queryList = new PlayerQueryList(state, '(width > 400) or (orientation: portrait)');

  expect(queryList.matches).toBeFalsy();

  state.width.set(450);
  expect(queryList.matches).toBeTruthy();

  state.width.set(300);
  state.orientation.set('portrait');
  expect(queryList.matches).toBeTruthy();

  queryList.destroy();
});

it('should evaluate list', () => {
  const state = mediaState.create(),
    queryList = new PlayerQueryList(state, '(width >= 300),(stream-type: "on-demand")');

  expect(queryList.matches).toBeFalsy();

  state.width.set(450);
  expect(queryList.matches).toBeTruthy();

  state.width.set(0);
  state.inferredStreamType.set('on-demand');
  expect(queryList.matches).toBeTruthy();

  queryList.destroy();
});
