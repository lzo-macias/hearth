# 04 — Closures & refs

This is the one that caused your worst bug — the kind that fails silently, at
midnight, once a day.

## The concept: a closure captures a *binding*, not a value

```js
let x = 1
const show = () => console.log(x)
x = 2
show()   // 2  ← it reads the variable, not a copy
```

So far so good. Now the version that breaks:

```js
function makeCallback(x) {
  return () => console.log(x)   // `x` is this call's parameter — frozen for this closure
}
const cb = makeCallback(1)
// nothing you do later can change what `cb` sees. It's 1 forever.
```

**Both are "capture the binding."** The difference is whether that binding can ever
be reassigned. A function parameter, or a `const` inside a function body, is written
once — so a callback created there is frozen at those values for its whole life.

## Why this broke your midnight timer

React re-runs your component function on every render. Each render creates **new**
`count` and `todaysMeals` bindings. Your effect had `[]` deps, so it ran once, on the
first render — and the `setTimeout` callback it created closed over *that* render's
bindings.

```js
useEffect(() => {
  setTimeout(() => {
    save({ protein: count })   // `count` from render #1, forever. Always 0.
  }, msUntilMidnight)
}, [])
```

Sixteen hours later it fired and faithfully recorded `protein: 0`. No error. No
warning. Just a blank day, every day.

## The fix: a mutable box

If the callback can't see new bindings, hand it something whose *contents* can
change. One object, created once, mutated on every render:

```js
const latest = { count: 0 }      // created once
// every render:  latest.count = count
// the callback:  latest.count   ← reads whatever is in the box NOW
```

**That box is exactly what `useRef` is.** `useRef(x)` returns `{ current: x }` — the
same object on every render, so a closure that captured it early still sees later
writes.

```js
const latest = useRef({ count, todaysMeals })
useEffect(() => { latest.current = { count, todaysMeals } })   // no deps: every render
// inside the timeout:  latest.current.count   ← fresh
```

## Ref vs state — the actual rule

| | `useRef` | `useState` |
|---|---|---|
| Survives re-renders | yes | yes |
| Changing it re-renders | **no** | yes |
| Use for | timer ids, latest-value mirrors, DOM nodes | anything the UI displays |

Your app needed both, correctly: `timerId` is a ref (never rendered), `dates` is
state (`Counter` displays it). Getting these backwards means either a component that
won't update, or one that re-renders constantly for no reason.

## The other half: cleanup

`setTimeout` returns an id. Storing it is pointless unless something clears it.

```js
useEffect(() => {
  const id = setTimeout(fn, ms)
  return () => clearTimeout(id)      // ← the whole point
}, [])
```

**A local `const` is enough when the same effect creates and clears the timer.** You
only need a ref when the timer **re-arms itself** (the id changes over time) or when
something outside the effect must cancel it. Your midnight timer reschedules itself,
so a ref is genuinely the right call there.

## Questions

1. `useRef(0)` returns what, exactly? What makes it different across renders from
   `let x = 0` in the component body?
2. Why does the "mirror" effect deliberately have **no** dependency array?
3. When is a plain `const id = setTimeout(...)` enough, and when do you truly need a ref?
4. You put your day counter in a ref instead of state. The number never updates on
   screen. Why?
5. In dev, React StrictMode mounts → unmounts → mounts every component. What
   happens to a `setTimeout` in an effect with no cleanup?

## Your task

`exercise.js` is plain JavaScript — no React. That's the point: **`useRef` isn't a
React concept, it's a closure workaround.** Once you can build the box by hand, the
hook is obvious.
