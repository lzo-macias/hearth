// CHANGED (new file): dayKey used to be inlined in App.jsx, which meant App and
// Counter could drift apart on format. If the writer and the reader ever disagree,
// every lookup silently returns undefined — so it lives in one place now.

// Local-date key: "2026-08-03". Sorts chronologically as plain text and never
// collides across months (day-of-month alone made Sep 3 overwrite Aug 3).
//
// Deliberately NOT `d.toISOString().slice(0, 10)` — toISOString converts to UTC
// first, so anything logged after ~7pm Eastern would be filed under tomorrow.
export function dayKey(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // getMonth() is 0-indexed
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// The last N calendar days, oldest first, today last.
// setDate() with a negative/zero value rolls back across month and year
// boundaries automatically, so there's no calendar math to get wrong.
export function lastNDays(n = 7) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}
