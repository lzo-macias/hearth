// Everything the app knows lives in one localStorage record. Nothing here talks
// to React — App owns the state, this owns the disk format.
import { dayKey } from './date'

const KEY = 'mfp:v1'
const VERSION = 1

// localStorage throws in private mode and in some embedded webviews. A tracker
// that can't save is still usable, so every access is wrapped and failure is
// treated as "no saved data".
function readRaw() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Meals are stored as { name: count } and rebuilt against the live Menu on load.
// Storing the whole item record would bake in the food photo's build-hashed URL
// (./assets/food/eggs.jpg -> /assets/eggs-Bl5VpfhZ.jpg), which changes on every
// rebuild — saved meals would come back pointing at 404s.
function serializeMeals(meals) {
  return Object.fromEntries(
    Object.entries(meals ?? {}).map(([name, entry]) => [name, entry.count])
  )
}

function reviveMeals(stored, menu) {
  const out = {}
  for (const [name, count] of Object.entries(stored ?? {})) {
    const item = menu.get(name)
    // A food that's since been dropped from the Menu can't be re-rendered, so
    // it's skipped rather than restored as { item: undefined }.
    if (!item || !Number.isFinite(count) || count <= 0) continue
    out[name] = { item, count }
  }
  return out
}

// Returns state ready to hand straight to useState, already caught up to today.
//
// The midnight timeout in App only fires if the tab is open when the clock rolls
// over. Close the laptop at 11pm and reopen it Tuesday and that never happened —
// so the catch-up also runs here, on load.
export function loadState({ menu, goal }) {
  const today = dayKey(new Date())
  const saved = readRaw()

  if (!saved || saved.version !== VERSION) {
    return { day: today, count: 0, todaysMeals: {}, dates: new Map() }
  }

  // Map doesn't survive JSON, so it goes out as [key, value] pairs and comes
  // back through the Map constructor.
  const dates = new Map(
    (Array.isArray(saved.dates) ? saved.dates : [])
      .filter(([key]) => typeof key === 'string')
      .map(([key, entry]) => [
        key,
        {
          protein: Number(entry?.protein) || 0,
          pass: Boolean(entry?.pass),
          todaysMeals: reviveMeals(entry?.meals, menu),
        },
      ])
  )

  let count = Number(saved.count) || 0
  let todaysMeals = reviveMeals(saved.meals, menu)
  const savedDay = typeof saved.day === 'string' ? saved.day : today

  if (savedDay !== today) {
    // Only the last day the app was open is recoverable — days spent away leave
    // no trace, which is correct: nothing was logged on them.
    if (count > 0 || Object.keys(todaysMeals).length > 0) {
      dates.set(savedDay, { protein: count, pass: count >= goal, todaysMeals })
    }
    count = 0
    todaysMeals = {}
  }

  return { day: today, count, todaysMeals, dates }
}

export function saveState({ day, count, todaysMeals, dates }) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: VERSION,
        day,
        count,
        meals: serializeMeals(todaysMeals),
        dates: [...dates].map(([key, entry]) => [
          key,
          {
            protein: entry.protein,
            pass: entry.pass,
            meals: serializeMeals(entry.todaysMeals),
          },
        ]),
      })
    )
  } catch {
    // Quota exceeded or storage disabled — the in-memory session still works.
  }
}
