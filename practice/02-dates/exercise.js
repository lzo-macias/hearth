// 02 — Dates.  Run: node --test practice/02-dates/
//
// Note every function takes the "current" date as a parameter. Code that calls
// new Date() internally cannot be tested. This is a habit worth keeping.

/**
 * Local-date key, "YYYY-MM-DD". Zero-padded.
 * Must NOT use toISOString() — that converts to UTC and shifts the day.
 * BUG THIS DRILLS: keying `dates` by getDate() collided across months.
 */
export function dayKey(date) {
  throw new Error('TODO: dayKey')
}

/** True if both Dates fall on the same local calendar day. */
export function isSameDay(a, b) {
  throw new Error('TODO: isSameDay')
}

/**
 * The last `n` calendar days ending with `from`, oldest first.
 * lastNDays(new Date(2026,7,3), 7) -> [Jul 28 ... Aug 3]
 * Must handle crossing a month boundary.
 */
export function lastNDays(from, n) {
  throw new Error('TODO: lastNDays')
}

/**
 * How many days in this month? monthIndex is 0-based (0 = January).
 * Hint: day 0 of the NEXT month. No leap-year logic needed.
 */
export function daysInMonth(year, monthIndex) {
  throw new Error('TODO: daysInMonth')
}

/**
 * Which weekday does the 1st fall on? 0=Sunday .. 6=Saturday.
 * This is how many blank cells a calendar grid needs before day 1.
 */
export function firstWeekdayOfMonth(year, monthIndex) {
  throw new Error('TODO: firstWeekdayOfMonth')
}

/**
 * The next midnight strictly after `from`, as a Date.
 * Rely on day-overflow rather than doing month arithmetic yourself.
 */
export function nextMidnight(from) {
  throw new Error('TODO: nextMidnight')
}

/** Milliseconds from `from` until the next midnight. A NUMBER, not an array. */
export function msUntilMidnight(from) {
  throw new Error('TODO: msUntilMidnight')
}

/**
 * Shift a date by `delta` days without mutating the input.
 * addDays(new Date(2026,0,31), 1) -> Feb 1 2026
 */
export function addDays(date, delta) {
  throw new Error('TODO: addDays')
}
