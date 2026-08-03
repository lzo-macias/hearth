import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  dayKey, isSameDay, lastNDays, daysInMonth,
  firstWeekdayOfMonth, nextMidnight, msUntilMidnight, addDays,
} from './exercise.js'

test('dayKey zero-pads and is 1-indexed for months', () => {
  assert.equal(dayKey(new Date(2026, 7, 3)), '2026-08-03')   // month 7 = August
  assert.equal(dayKey(new Date(2026, 0, 1)), '2026-01-01')
  assert.equal(dayKey(new Date(2026, 11, 25)), '2026-12-25')
})

test('dayKey uses LOCAL time, not UTC', () => {
  // 11pm local. toISOString() would roll this to the next day in any timezone
  // behind UTC — the exact bug that would misfile evening entries.
  const lateEvening = new Date(2026, 7, 3, 23, 30)
  assert.equal(dayKey(lateEvening), '2026-08-03')
})

test('dayKey sorts chronologically as plain strings', () => {
  const keys = [
    dayKey(new Date(2026, 8, 1)),
    dayKey(new Date(2026, 7, 28)),
    dayKey(new Date(2026, 7, 3)),
  ].sort()
  assert.deepEqual(keys, ['2026-08-03', '2026-08-28', '2026-09-01'])
})

test('isSameDay ignores the time of day', () => {
  assert.ok(isSameDay(new Date(2026, 7, 3, 0, 1), new Date(2026, 7, 3, 23, 59)))
  assert.ok(!isSameDay(new Date(2026, 7, 3), new Date(2026, 7, 4)))
  assert.ok(!isSameDay(new Date(2025, 7, 3), new Date(2026, 7, 3)), 'different years')
})

test('lastNDays returns n days, oldest first, ending on `from`', () => {
  const days = lastNDays(new Date(2026, 7, 3), 7)
  assert.equal(days.length, 7)
  assert.equal(dayKey(days[0]), '2026-07-28')
  assert.equal(dayKey(days[6]), '2026-08-03')
})

test('lastNDays crosses a year boundary', () => {
  const days = lastNDays(new Date(2026, 0, 2), 5)
  assert.equal(dayKey(days[0]), '2025-12-29')
  assert.equal(dayKey(days[4]), '2026-01-02')
})

test('lastNDays returns distinct Date objects (setters mutate!)', () => {
  const days = lastNDays(new Date(2026, 7, 3), 3)
  assert.notEqual(days[0], days[1], 'reusing one Date gives you 3 refs to the same value')
  assert.equal(new Set(days.map(dayKey)).size, 3)
})

test('daysInMonth', () => {
  assert.equal(daysInMonth(2026, 0), 31)   // Jan
  assert.equal(daysInMonth(2026, 1), 28)   // Feb, common year
  assert.equal(daysInMonth(2024, 1), 29)   // Feb, leap year
  assert.equal(daysInMonth(2026, 3), 30)   // Apr
  assert.equal(daysInMonth(2026, 11), 31)  // Dec
})

test('firstWeekdayOfMonth', () => {
  assert.equal(firstWeekdayOfMonth(2026, 7), 6)   // Aug 1 2026 is a Saturday
  assert.equal(firstWeekdayOfMonth(2026, 1), 0)   // Feb 1 2026 is a Sunday
})

test('nextMidnight is the following day at 00:00:00.000', () => {
  const m = nextMidnight(new Date(2026, 7, 3, 20, 30, 15, 500))
  assert.equal(dayKey(m), '2026-08-04')
  assert.equal(m.getHours(), 0)
  assert.equal(m.getMinutes(), 0)
  assert.equal(m.getSeconds(), 0)
  assert.equal(m.getMilliseconds(), 0)
})

test('nextMidnight rolls across month and year ends', () => {
  assert.equal(dayKey(nextMidnight(new Date(2026, 7, 31, 12))), '2026-09-01')
  assert.equal(dayKey(nextMidnight(new Date(2026, 11, 31, 12))), '2027-01-01')
})

test('msUntilMidnight is a number', () => {
  const ms = msUntilMidnight(new Date(2026, 7, 3, 20, 0, 0, 0))
  assert.equal(typeof ms, 'number', 'passing [ms] to setTimeout only works by accident')
  assert.equal(ms, 4 * 60 * 60 * 1000)   // 8pm -> midnight = 4 hours
})

test('addDays does not mutate its input', () => {
  const original = new Date(2026, 0, 31)
  const shifted = addDays(original, 1)
  assert.equal(dayKey(original), '2026-01-31', 'input must be untouched')
  assert.equal(dayKey(shifted), '2026-02-01')
  assert.equal(dayKey(addDays(new Date(2026, 7, 3), -6)), '2026-07-28')
})
