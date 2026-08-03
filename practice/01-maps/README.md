# 01 — Maps

## The concept

A `Map` is **not** an object. It looks like one, which is exactly what makes it
dangerous. Three things behave differently:

```js
const m = new Map([['a', 1]])

m['a']        // undefined  ← reads a property named "a" on the Map object itself
m.get('a')    // 1          ← the actual lookup
m('a')        // TypeError: m is not a function
```

Bracket access on a Map is *silently wrong*. No error, just `undefined`. It's the
worst failure mode there is.

### Why use a Map at all?

- **Keys can be any type.** Object keys are coerced to strings — `obj[1]` and
  `obj["1"]` are the same key. Map keys are not.
- **`.size`** is a property. Objects need `Object.keys(o).length`.
- **Insertion order is guaranteed** for all key types.
- **No prototype collisions.** `obj["constructor"]` already exists; `map.get("constructor")` doesn't.

Your app uses **both**, deliberately: `dates` is a `Map` (dynamic keys added over
time), `todaysMeals` is a plain object (fits `{...spread}` update patterns and
JSON serialization).

### The immutability rule

React compares by identity. Mutating a Map in place doesn't change its identity, so
React skips the re-render:

```js
setDates(prev => { prev.set(k, v); return prev })      // ✗ same object → no re-render
setDates(prev => new Map(prev).set(k, v))              // ✓ new object → re-renders
```

`.set()` returns the Map, which is what makes that one-liner work. `.delete()`
returns a **boolean** — a very easy way to accidentally return `true` from an updater.

## Questions — answer before you code

1. `dates[3]` returns `undefined` on a Map that definitely has key `3`. Why?
2. What's the difference between `map.set(k,v)`'s return value and `map.delete(k)`'s?
3. Why does `new Map(prev)` matter for React, when `prev.set(...)` would be less work?
4. Your `todaysMeals` is an object but `dates` is a Map. Give one concrete reason
   each choice is right.
5. `JSON.stringify(new Map([['a',1]]))` returns `"{}"`. Why — and what does that
   mean for saving `dates` to localStorage?

## Your task

Open `exercise.js`. Implement every function. Run:

```bash
node --test practice/01-maps/
```
