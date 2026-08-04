export const range = (n) => Array.from({ length: n }, (_, i) => i)

// Array.from materializes the holes; Array(n).map(fn) would never call fn.
export const buildN = (n, fn) => Array.from({ length: n }, (_, i) => fn(i))

export function filterByQuery(pairs, query) {
  const q = query.trim().toLowerCase()
  if (!q) return pairs
  return pairs.filter(([name]) => name.toLowerCase().includes(q))   // includes, not include
}

export function levelFor(protein, goal) {
  if (protein == null || protein <= 0) return 0
  const pct = protein / goal
  if (pct >= 1) return 4
  if (pct >= 0.7) return 3
  if (pct >= 0.4) return 2
  return 1
}

export const calendarCells = (leadingBlanks, daysInMonth) => [
  ...Array.from({ length: leadingBlanks }, () => null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
]

export const totalProtein = (meals) =>
  Object.values(meals).reduce((sum, m) => sum + (m.item?.protein ?? 0) * m.count, 0)
