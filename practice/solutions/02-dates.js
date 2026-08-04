// Built from local getters, never toISOString() — that converts to UTC and shifts the day.
export const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const isSameDay = (a, b) => dayKey(a) === dayKey(b)

export const lastNDays = (from, n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(from)          // fresh object each iteration — setters mutate
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })

// Day 0 of the next month == the last day of this one. Leap years handled for free.
export const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate()

export const firstWeekdayOfMonth = (year, monthIndex) => new Date(year, monthIndex, 1).getDay()

// Day overflow rolls into the next month/year automatically.
export const nextMidnight = (from) =>
  new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1, 0, 0, 0, 0)

export const msUntilMidnight = (from) => nextMidnight(from) - from   // a number

export function addDays(date, delta) {
  const d = new Date(date)
  d.setDate(d.getDate() + delta)
  return d
}
