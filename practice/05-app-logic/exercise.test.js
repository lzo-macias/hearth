import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addMeal, removeMeal, totalProtein, crossedGoal, rollOver } from './exercise.js'

const CHICKEN = { protein: 31 }
const SALMON = { protein: 25 }

test('addMeal creates an entry with the item attached', () => {
  const next = addMeal({}, 'chicken', CHICKEN)
  assert.deepEqual(next, { chicken: { item: CHICKEN, count: 1 } })
  assert.ok(next.chicken.item, 'the item must be stored on the FIRST add')
})

test('addMeal increments and keeps the item', () => {
  let m = addMeal({}, 'chicken', CHICKEN)
  m = addMeal(m, 'chicken', CHICKEN)
  assert.equal(m.chicken.count, 2)
  assert.equal(m.chicken.item, CHICKEN)
})

test('addMeal does not mutate the input', () => {
  const before = { chicken: { item: CHICKEN, count: 1 } }
  const after = addMeal(before, 'chicken', CHICKEN)
  assert.equal(before.chicken.count, 1, 'input must be untouched')
  assert.notEqual(after, before)
})

test('removeMeal decrements above 1', () => {
  const m = removeMeal({ chicken: { item: CHICKEN, count: 3 } }, 'chicken')
  assert.equal(m.chicken.count, 2)
})

test('removeMeal deletes the key at 1', () => {
  const m = removeMeal({ chicken: { item: CHICKEN, count: 1 } }, 'chicken')
  assert.deepEqual(m, {})
  assert.ok(!('chicken' in m))
})

test('removeMeal on a missing food is a no-op', () => {
  const before = { chicken: { item: CHICKEN, count: 1 } }
  assert.deepEqual(removeMeal(before, 'tofu'), before)
})

test('totalProtein', () => {
  assert.equal(totalProtein({
    chicken: { item: CHICKEN, count: 2 },
    salmon: { item: SALMON, count: 1 },
  }), 87)
  assert.equal(totalProtein({}), 0)
  assert.equal(totalProtein({ bad: { item: undefined, count: 2 } }), 0)
})

test('crossedGoal is true only on the transition', () => {
  assert.equal(crossedGoal(150, 165, 160), true)
  assert.equal(crossedGoal(0, 160, 160), true, 'landing exactly on the goal counts')
  assert.equal(crossedGoal(165, 190, 160), false, 'already past — no second popup')
  assert.equal(crossedGoal(100, 150, 160), false, 'never reached it')
})

test('crossedGoal handles dropping back below and re-crossing', () => {
  assert.equal(crossedGoal(170, 140, 160), false)
  assert.equal(crossedGoal(140, 170, 160), true)
})

const baseState = () => ({
  meals: { chicken: { item: CHICKEN, count: 6 } },   // 186g
  dates: new Map(),
  lastActiveDay: '2026-08-03',
})

test('rollOver is a no-op on the same day (identity preserved)', () => {
  const s = baseState()
  assert.equal(rollOver(s, '2026-08-03', 160), s, 'must return the SAME reference')
})

test('rollOver archives the previous day and resets', () => {
  const next = rollOver(baseState(), '2026-08-04', 160)
  assert.equal(next.lastActiveDay, '2026-08-04')
  assert.deepEqual(next.meals, {}, 'the new day starts empty')

  const archived = next.dates.get('2026-08-03')
  assert.equal(archived.protein, 186)
  assert.equal(archived.pass, true, '186 >= 160')
  assert.equal(archived.meals.chicken.count, 6, 'the meal breakdown is kept')
})

test('rollOver records a missed goal as pass:false', () => {
  const s = { meals: { salmon: { item: SALMON, count: 1 } }, dates: new Map(), lastActiveDay: '2026-08-03' }
  const next = rollOver(s, '2026-08-04', 160)
  assert.equal(next.dates.get('2026-08-03').pass, false)
})

test('rollOver does not mutate the incoming state or Map', () => {
  const s = baseState()
  const originalSize = s.dates.size
  rollOver(s, '2026-08-04', 160)
  assert.equal(s.dates.size, originalSize, 'the old Map must be untouched')
  assert.equal(s.lastActiveDay, '2026-08-03')
  assert.equal(s.meals.chicken.count, 6)
})

test('rollOver on first ever run just adopts today', () => {
  const s = { meals: {}, dates: new Map(), lastActiveDay: null }
  const next = rollOver(s, '2026-08-03', 160)
  assert.equal(next.lastActiveDay, '2026-08-03')
  assert.equal(next.dates.size, 0, 'nothing to archive yet')
})

test('rollOver across a gap archives only the last active day', () => {
  // Tab closed Aug 3, reopened Aug 9. Aug 4-8 have no data and never existed.
  const next = rollOver(baseState(), '2026-08-09', 160)
  assert.equal(next.dates.size, 1)
  assert.ok(next.dates.has('2026-08-03'))
})

test('rollOver is idempotent — calling twice changes nothing further', () => {
  const once = rollOver(baseState(), '2026-08-04', 160)
  const twice = rollOver(once, '2026-08-04', 160)
  assert.equal(twice, once, 'StrictMode double-invokes; this must be safe')
})
