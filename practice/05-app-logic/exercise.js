// 05 — App logic as pure functions.  Run: node --test practice/05-app-logic/
//
// The shape of state we're managing:
//   { meals: { [name]: { item, count } }, dates: Map, lastActiveDay: string }

/**
 * Add one serving of `item` under `name`. Returns a NEW meals object.
 * If the food is already there, increment its count — keep the existing item.
 * BUG THIS DRILLS: the "first click" path passed [name] without item, storing
 * {item: undefined, count: 1}.
 */
export function addMeal(meals, name, item) {
  throw new Error('TODO: addMeal')
}

/**
 * Remove one serving. Returns a NEW meals object.
 *   count > 1  -> decrement
 *   count === 1 -> remove the key entirely
 *   not present -> return meals unchanged (same reference is fine)
 */
export function removeMeal(meals, name) {
  throw new Error('TODO: removeMeal')
}

/** Total grams across all meals. Guard a missing item. */
export function totalProtein(meals) {
  throw new Error('TODO: totalProtein')
}

/**
 * Did this update CROSS the goal (rather than merely sit above it)?
 * crossedGoal(150, 165, 160) -> true
 * crossedGoal(165, 190, 160) -> false   <- already past; do not re-open the popup
 */
export function crossedGoal(prevTotal, nextTotal, goal) {
  throw new Error('TODO: crossedGoal')
}

/**
 * Roll the day over if the date changed.
 *
 * state: { meals, dates, lastActiveDay }
 * If state.lastActiveDay === todayKey  -> return state UNCHANGED (same reference).
 * Otherwise return a new state where:
 *   - dates gains an entry at lastActiveDay: { protein, pass, meals }
 *   - meals resets to {}
 *   - lastActiveDay becomes todayKey
 *
 * If lastActiveDay is null (first ever run), just set it — archive nothing.
 * Must not mutate the incoming state or its Map.
 */
export function rollOver(state, todayKey, goal) {
  throw new Error('TODO: rollOver')
}
