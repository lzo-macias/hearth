export const addMeal = (meals, name, item) => ({
  ...meals,
  [name]: { item, count: (meals[name]?.count ?? 0) + 1 },
})

export function removeMeal(meals, name) {
  const current = meals[name]
  if (!current) return meals                                  // no-op, same reference
  if (current.count > 1) {
    return { ...meals, [name]: { ...current, count: current.count - 1 } }
  }
  const { [name]: _removed, ...rest } = meals                 // destructure-to-omit
  return rest
}

export const totalProtein = (meals) =>
  Object.values(meals).reduce((sum, m) => sum + (m.item?.protein ?? 0) * m.count, 0)

// The transition, not the condition. Both halves matter.
export const crossedGoal = (prevTotal, nextTotal, goal) =>
  prevTotal < goal && nextTotal >= goal

export function rollOver(state, todayKey, goal) {
  if (state.lastActiveDay === todayKey) return state          // identity preserved
  if (state.lastActiveDay == null) return { ...state, lastActiveDay: todayKey }

  const protein = totalProtein(state.meals)
  const dates = new Map(state.dates).set(state.lastActiveDay, {
    protein,
    pass: protein >= goal,
    meals: state.meals,
  })
  return { meals: {}, dates, lastActiveDay: todayKey }
}
