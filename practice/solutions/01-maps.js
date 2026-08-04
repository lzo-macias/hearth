export const getEntry = (map, key) => map.get(key)

// .set() returns the map, so this is a one-liner. Copy FIRST — never mutate.
export const withEntry = (map, key, value) => new Map(map).set(key, value)

export function withoutEntry(map, key) {
  const next = new Map(map)
  next.delete(key)        // returns a boolean — must not be returned directly
  return next
}

export const toPairs = (map) => [...map]            // same as [...Menu] in App.jsx
export const fromPairs = (pairs) => new Map(pairs)  // ONE argument, an array of pairs

// JSON.stringify(map) is "{}" — a Map's entries aren't own enumerable properties.
export const serializeMap = (map) => JSON.stringify([...map])
export const deserializeMap = (json) => new Map(JSON.parse(json))

export const totalOf = (map, field) =>
  [...map.values()].reduce((sum, v) => sum + (v?.[field] ?? 0), 0)
