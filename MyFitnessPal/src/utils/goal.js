// Shared by the week strip and the month calendar so both read as one system —
// same thresholds, same colors, same meaning.

// Sequential ramp: one hue, light -> dark, by share of the daily goal.
// 0 = no data, 4 = goal met. Maps to .lvl0 - .lvl4 in Counter.css.
export function levelFor(protein, goal) {
  if (protein == null || protein <= 0) return 0
  const pct = protein / goal
  if (pct >= 1) return 4
  if (pct >= 0.7) return 3
  if (pct >= 0.4) return 2
  return 1
}

// `dates` is only written by the midnight timeout, so the current day is never
// in the Map. Both views need today merged from live state or today's cell
// always reads empty.
export function entryFor(dates, key, todayKey, live) {
  if (key === todayKey) {
    return {
      protein: live.totalProtein,
      pass: live.totalProtein >= live.goal,
      todaysMeals: live.todaysMeals,
    }
  }
  return dates.get(key)
}
