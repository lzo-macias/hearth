// 03 — Arrays & derived data.  Run: node --test practice/03-arrays/

/** [0, 1, 2, ..., n-1]. Must work for n = 0. */
export function range(n) {
  throw new Error('TODO: range')
}

/**
 * n items, each built by fn(i).
 * BUG THIS DRILLS: Array(n).map(fn) silently returns holes.
 */
export function buildN(n, fn) {
  throw new Error('TODO: buildN')
}

/**
 * Case-insensitive filter of [name, item] pairs by name substring.
 * An empty/whitespace query returns everything.
 * BUG THIS DRILLS: `.include()` (not a method) and forgetting the entries are
 * PAIRS, so `name.toLowerCase()` was being called on an array.
 */
export function filterByQuery(pairs, query) {
  throw new Error('TODO: filterByQuery')
}

/**
 * Sequential ramp step for a calendar heatmap.
 *   0 -> no data (protein null/undefined/<=0)
 *   1 -> under 40% of goal
 *   2 -> 40-69%
 *   3 -> 70-99%
 *   4 -> goal met (>= 100%)
 */
export function levelFor(protein, goal) {
  throw new Error('TODO: levelFor')
}

/**
 * Cells for a month grid: `leadingBlanks` nulls, then 1..daysInMonth.
 * calendarCells(2, 3) -> [null, null, 1, 2, 3]
 * The nulls are why the 1st lands under the right weekday column.
 */
export function calendarCells(leadingBlanks, daysInMonth) {
  throw new Error('TODO: calendarCells')
}

/**
 * Total protein from a todaysMeals object: { name: { item, count } }.
 * Guard against a missing `item` — your app really did store {item: undefined}.
 */
export function totalProtein(meals) {
  throw new Error('TODO: totalProtein')
}
