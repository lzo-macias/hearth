// 01 — Maps.  Implement each function; delete the `throw` when you do.
// Run: node --test practice/01-maps/

/**
 * Read one entry out of a Map.
 * BUG THIS DRILLS: your Counter had `dates[key]`, which silently returned undefined.
 */
export function getEntry(map, key) {
  throw new Error('TODO: getEntry')
}

/**
 * Return a NEW Map with key set to value. Must not mutate the original.
 * BUG THIS DRILLS: `setDates(prev => { prev.set(...) })` — mutated, and returned undefined.
 * Hint: .set() returns the map itself.
 */
export function withEntry(map, key, value) {
  throw new Error('TODO: withEntry')
}

/**
 * Return a NEW Map without `key`. Must not mutate the original.
 * Careful: .delete() returns a boolean, not the map.
 */
export function withoutEntry(map, key) {
  throw new Error('TODO: withoutEntry')
}

/**
 * Convert a Map to an array of [key, value] pairs.
 * This is what `menu={[...Menu]}` does in App.jsx.
 */
export function toPairs(map) {
  throw new Error('TODO: toPairs')
}

/**
 * Build a Map from an array of [key, value] pairs.
 * Remember: the Map constructor takes ONE argument — an array of pairs.
 * BUG THIS DRILLS: your original `new Map(["chicken", {...}], ["salmon", {...}])`.
 */
export function fromPairs(pairs) {
  throw new Error('TODO: fromPairs')
}

/**
 * Serialize a Map to a JSON string that round-trips.
 * BUG THIS DRILLS: JSON.stringify(map) returns "{}" — you'd silently save nothing
 * to localStorage. You need to convert to pairs first.
 */
export function serializeMap(map) {
  throw new Error('TODO: serializeMap')
}

/**
 * Parse what serializeMap produced back into a Map.
 */
export function deserializeMap(json) {
  throw new Error('TODO: deserializeMap')
}

/**
 * Sum a numeric field across all values in the Map.
 * e.g. totalOf(dates, 'protein') -> 340
 * Missing/undefined fields count as 0.
 */
export function totalOf(map, field) {
  throw new Error('TODO: totalOf')
}
