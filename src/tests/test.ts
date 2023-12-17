import { DI } from '../di';

beforeEach(() => {
  DI.clear();
});

test('Test adding a module', () => {
  DI.addModule('testModule');
  const module = DI.scope('testModule');
  expect(module).toBeDefined();
});

test("Test referencing a module that doesn't exist", () => {
  expect(() => {
    DI.scope('testModule');
  }).toThrow();
});

test('Test global graph basic providing and retrieval', () => {
  const testSubject = 'dog';
  DI.provide(testSubject, typeof testSubject);

  const retrievedSubject = DI.get('string');
  expect(retrievedSubject).toBe(testSubject);
});

test("Try and get something that isn't provided", () => {
  expect(() => {
    DI.get('string');
  }).toThrow();
});

test('Test optional names are working', () => {
  const testSubject1 = 'dog';
  const testSubject2 = 'cat';
  DI.provide(testSubject1, typeof testSubject1, 'KEY1');
  DI.provide(testSubject2, typeof testSubject2, 'KEY2');

  const retrievedSubject = DI.get('string', 'KEY1');
  expect(retrievedSubject).toBe(testSubject1);
});

test('Test that ambiguous naming throws when not providing a named key', () => {
  expect(() => {
    const testSubject1 = 'dog';
    const testSubject2 = 'cat';
    DI.provide(testSubject1, typeof testSubject1, 'KEY1');
    DI.provide(testSubject2, typeof testSubject2, 'KEY2');
    DI.get('string');
  }).toThrow();
});

test('Test that providing the same object twice fails (with no name)', () => {
  expect(() => {
    const testSubject1 = 'dog';
    const testSubject2 = 'cat';
    DI.provide(testSubject1, typeof testSubject1);
    DI.provide(testSubject2, typeof testSubject2);
    DI.get('string');
  }).toThrow();
});

test('Test that providing the same object twice fails (with same name)', () => {
  expect(() => {
    const testSubject1 = 'dog';
    const testSubject2 = 'cat';
    DI.provide(testSubject1, typeof testSubject1, 'KEY1');
    DI.provide(testSubject2, typeof testSubject2, 'KEY1');
    DI.get('string');
  }).toThrow();
});

test('Test that clear works with variables', () => {
  expect(() => {
    DI.provide('cat', 'string');
    DI.clear();
    DI.get('string');
  }).toThrow();
});

test('Test that clear works with modules', () => {
  expect(() => {
    DI.addModule('test');
    DI.clear();
    DI.scope('test');
  }).toThrow();
});

test('Test making scopes works', () => {
  DI.addModule('testModule');
  DI.scope('testModule').provide('test', 'string');
  const value = DI.scope('testModule').get('string');
  expect(value).toBe('test');
});

test('Test that scopes are separated', () => {
  expect(() => {
    DI.addModule('test');
    DI.provide('dog', 'string');
    DI.scope('test').get('string');
  }).toThrow();
});

test('Test that scopes can be cleared', () => {
  expect(() => {
    DI.addModule('test');
    DI.scope('test').provide('dog', 'string');
    DI.scope('test').clear();
    DI.scope('test').get('string');
  }).toThrow();
});

test('Test 2 adds of modules fails', () => {
  expect(() => {
    DI.addModule('test');
    DI.addModule('test');
  }).toThrow();
});

test('Test overriding adding scopes works', () => {
  DI.addModule('testModule');
  DI.addModule('testModule', true);
});
