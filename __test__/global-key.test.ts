import { spawnProcess } from '../src';

test('Should not pollute global scope by default', () => {
  const snapshot = { ...global };
  spawnProcess();
  expect(global).toEqual(snapshot);
});

test('Should use global scope to store process', () => {
  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in global) {
    globalKey += '_';
  }
  const snapshot = { ...global };
  spawnProcess({ globalKey });
  expect(global).not.toEqual(snapshot);
  expect(global).toEqual({ ...snapshot, [globalKey]: {} });
  delete global[globalKey];
});
