import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getEntry, withEntry, withoutEntry, toPairs, fromPairs,
  serializeMap, deserializeMap, totalOf,
} from './exercise.js'

const sample = () => new Map([
  ['2026-08-01', { protein: 180, pass: true }],
  ['2026-08-02', { protein: 90, pass: false }],
])

test('getEntry reads via .get, not brackets', () => {
  assert.deepEqual(getEntry(sample(), '2026-08-01'), { protein: 180, pass: true })
  assert.equal(getEntry(sample(), 'nope'), undefined)
})

test('getEntry works with non-string keys (objects would coerce these)', () => {
  const m = new Map([[1, 'number one'], ['1', 'string one']])
  assert.equal(getEntry(m, 1), 'number one')
  assert.equal(getEntry(m, '1'), 'string one')
})

test('withEntry returns a NEW map and leaves the original alone', () => {
  const original = sample()
  const next = withEntry(original, '2026-08-03', { protein: 200, pass: true })
  assert.notEqual(next, original, 'must be a different object — React compares identity')
  assert.equal(original.size, 2, 'original must not be mutated')
  assert.equal(next.size, 3)
  assert.deepEqual(next.get('2026-08-03'), { protein: 200, pass: true })
})

test('withEntry overwrites an existing key', () => {
  const next = withEntry(sample(), '2026-08-02', { protein: 999, pass: true })
  assert.equal(next.size, 2)
  assert.equal(next.get('2026-08-02').protein, 999)
})

test('withoutEntry returns a new map, not a boolean', () => {
  const original = sample()
  const next = withoutEntry(original, '2026-08-01')
  assert.ok(next instanceof Map, '.delete() returns a boolean — do not return it')
  assert.equal(next.size, 1)
  assert.equal(original.size, 2)
})

test('toPairs / fromPairs round-trip', () => {
  const m = sample()
  const pairs = toPairs(m)
  assert.ok(Array.isArray(pairs))
  assert.equal(pairs.length, 2)
  assert.deepEqual(pairs[0], ['2026-08-01', { protein: 180, pass: true }])
  assert.deepEqual(fromPairs(pairs), m)
})

test('fromPairs takes ONE array of pairs', () => {
  const m = fromPairs([['a', 1], ['b', 2]])
  assert.equal(m.size, 2)
  assert.equal(m.get('b'), 2)
})

test('serializeMap survives a JSON round-trip (plain stringify would not)', () => {
  const m = sample()
  const json = serializeMap(m)
  assert.equal(typeof json, 'string')
  assert.notEqual(json, '{}', 'JSON.stringify(map) gives "{}" — convert to pairs first')
  assert.deepEqual(deserializeMap(json), m)
})

test('deserializeMap gives back a real Map', () => {
  const restored = deserializeMap(serializeMap(sample()))
  assert.ok(restored instanceof Map)
  assert.equal(restored.get('2026-08-02').protein, 90)
})

test('totalOf sums a field across values', () => {
  assert.equal(totalOf(sample(), 'protein'), 270)
  assert.equal(totalOf(new Map(), 'protein'), 0)
})

test('totalOf treats a missing field as 0', () => {
  const m = new Map([['a', { protein: 10 }], ['b', {}]])
  assert.equal(totalOf(m, 'protein'), 10)
})
