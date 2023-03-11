import { List } from './list';
import { LIST_ADD, LIST_REMOVE } from './symbols';

interface ListItem {
  id: string;
  selected: boolean;
}

it('should create track list', () => {
  const list = new List();

  const addCallback = vi.fn();
  list.addEventListener('add', (e) => {
    addCallback(e.detail);
  });

  const removeCallback = vi.fn();
  list.addEventListener('remove', (e) => {
    removeCallback(e.detail);
  });

  const changeCallback = vi.fn();
  list.addEventListener('change', (e) => {
    changeCallback(e.detail);
  });

  const firstItem: ListItem = {
    id: 'a',
    selected: false,
  };

  const secondItem: ListItem = {
    id: 'b',
    selected: false,
  };

  list[LIST_ADD](firstItem);
  list[LIST_ADD](secondItem);

  secondItem.selected = true;

  expect(list).toHaveLength(2);
  expect(list.selectedIndex).toBe(1);
  expect(list.selected).toBe(secondItem);
  expect(list[0]).toBe(firstItem);
  expect(list[1]).toBe(secondItem);
  expect(list[2]).toBeUndefined();
  expect(addCallback).toHaveBeenCalledTimes(2);
  expect(addCallback).toHaveBeenCalledWith(firstItem);
  expect(addCallback).toHaveBeenCalledWith(secondItem);

  firstItem.selected = true;
  expect(list.selectedIndex).toBe(0);
  expect(list.selected).toBe(firstItem);
  expect(changeCallback).toHaveBeenCalledTimes(2);
  expect(changeCallback).toHaveBeenCalledWith({
    prev: secondItem,
    current: firstItem,
  });

  firstItem.selected = true;
  expect(changeCallback).toHaveBeenCalledTimes(2);

  list[LIST_REMOVE](firstItem);
  expect(list).toHaveLength(1);
  expect(changeCallback).toHaveBeenCalledTimes(3);
  expect(removeCallback).toHaveBeenCalledTimes(1);
  expect(removeCallback).toHaveBeenCalledWith(firstItem);

  secondItem.selected = true;
  expect(changeCallback).toHaveBeenCalledTimes(4);
  expect(changeCallback).toHaveBeenCalledWith({
    prev: null,
    current: secondItem,
  });
});
