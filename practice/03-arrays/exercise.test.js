import { test } from 'node:test'
import assert from 'node:assert/strict'
import { range, buildN, filterByQuery, levelFor, calendarCells, totalProtein } from './exercise.js'

test('range', () => {
  assert.deepEqual(range(5), [0, 1, 2, 3, 4])
  assert.deepEqual(range(0), [])
})

test('range has no holes (Array(n) alone would)', () => {
  const r = range(4)
  assert.equal(r.filter(() => true).length, 4, 'holes are skipped by filter/map')
  assert.ok(!(0 in Array(4)), 'sanity: a bare Array(4) really is sparse')
})

test('buildN calls fn for every index', () => {
  assert.deepEqual(buildN(3, (i) => i * 2), [0, 2, 4])
  let calls = 0
  buildN(5, () => { calls++ })
  assert.equal(calls, 5, 'Array(n).map(fn) would call fn ZERO times')
})

const MENU = [
  ['chicken breast', { protein: 31 }],
  ['salmon', { protein: 25 }],
  ['black beans', { protein: 15 }],
]

test('filterByQuery matches a substring, case-insensitively', () => {
  assert.deepEqual(filterByQuery(MENU, 'chick').map(([n]) => n), ['chicken breast'])
  assert.deepEqual(filterByQuery(MENU, 'SALMON').map(([n]) => n), ['salmon'])
  assert.deepEqual(filterByQuery(MENU, 'ea').map(([n]) => n), ['chicken breast', 'black beans'])
})

test('filterByQuery returns everything for an empty query', () => {
  assert.equal(filterByQuery(MENU, '').length, 3)
  assert.equal(filterByQuery(MENU, '   ').length, 3)
})

test('filterByQuery returns [] when nothing matches', () => {
  assert.deepEqual(filterByQuery(MENU, 'zzz'), [])
})

test('levelFor maps share-of-goal to a ramp step', () => {
  assert.equal(levelFor(null, 160), 0)
  assert.equal(levelFor(undefined, 160), 0)
  assert.equal(levelFor(0, 160), 0)
  assert.equal(levelFor(30, 160), 1)     // 19%
  assert.equal(levelFor(70, 160), 2)     // 44%
  assert.equal(levelFor(130, 160), 3)    // 81%
  assert.equal(levelFor(160, 160), 4)    // exactly the goal counts as met
  assert.equal(levelFor(400, 160), 4)    // over the goal is still 4
})

test('levelFor boundaries land on the right side', () => {
  assert.equal(levelFor(64, 160), 2)     // exactly 40%
  assert.equal(levelFor(63, 160), 1)
  assert.equal(levelFor(112, 160), 3)    // exactly 70%
  assert.equal(levelFor(111, 160), 2)
})

test('calendarCells pads the front with nulls', () => {
  assert.deepEqual(calendarCells(2, 3), [null, null, 1, 2, 3])
  assert.deepEqual(calendarCells(0, 3), [1, 2, 3])
  assert.equal(calendarCells(6, 31).length, 37)
})

test('totalProtein sums item.protein * count', () => {
  assert.equal(totalProtein({
    'chicken breast': { item: { protein: 31 }, count: 2 },
    'salmon': { item: { protein: 25 }, count: 1 },
  }), 87)
  assert.equal(totalProtein({}), 0)
})

test('totalProtein survives a missing item', () => {
  assert.equal(totalProtein({ broken: { item: undefined, count: 3 } }), 0)
})
