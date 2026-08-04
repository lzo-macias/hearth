# 05 — App logic as pure functions

Everything here is state logic pulled out of React. No hooks, no components — just
`(state, action) -> newState`. That's the whole point: **logic you can test is logic
you can trust**, and none of your real bugs needed React to reproduce.

## Concept A: updaters must be pure and must return

```js
setCount(...count += addedProtein)     // ✗ two bugs in seven characters
```

`count` is a `const` from destructuring — `count +=` throws *"Assignment to constant
variable."* And `...` on a number throws *"not iterable."*

```js
setCount(c => c + addedProtein)        // ✓
```

The updater form gets the **current** value as an argument, so it never reads a stale
`count` from the closure.

And it must **return**:

```js
setDates(prev => { const next = new Map(prev); next.set(k, v) })   // ✗ returns undefined
```

Your `dates` became `undefined` this way. React stores whatever you return.

## Concept B: derive the total, don't track it twice

You stored `count` **and** `todaysMeals[name].count`. Two sources for the same fact.
Any bug in either path silently desyncs them and nothing tells you which is right.

Deriving the total from meals means it *cannot* drift:

```js
const count = totalProtein(todaysMeals)
```

## Concept C: fire on the crossing, not the condition

```js
if (count >= goal) setShowPopup(true)      // ✗ true forever after
```

Once you're past 160 this is true on every render, so the popup reopens after every
add. You want the **transition**: `prev < goal && next >= goal`.

## Concept D: roll over by comparing dates, not by waiting

A `setTimeout` only fires if the tab is open and the machine is awake. Close the tab
at 7pm and nothing is ever recorded.

The reliable version stores the last active day and **compares on wake**:

```js
if (lastActiveDay !== todayKey) { /* archive it, reset */ }
```

It doesn't care *how* time passed — tab closed for a week, laptop asleep, browser
restarted. The timer becomes a nice-to-have for live updates, not the thing your data
depends on.

## Questions

1. Why does `setCount(c => c + n)` beat `setCount(count + n)`?
2. Name two things that go wrong when the same number is stored in two places.
3. Write the condition for "the user just crossed the goal on this update."
4. Why is date-comparison-on-wake strictly better than a midnight timer?
5. `rollOver` is called twice in a row with the same `todayKey`. What must happen the
   second time, and why does that matter for React StrictMode?
