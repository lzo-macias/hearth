# Quiz

Answer **out loud, without looking**, before opening the answers. If you can only
recognize the answer when you see it, you haven't got it yet.

Every question is a bug that actually happened in your app.

---

## Maps

1. `dates[3]` returns `undefined` on a Map that definitely has key `3`. Why is this
   worse than an error?
2. What does `.set()` return? What does `.delete()` return? Why does the difference
   matter inside a `setState` updater?
3. `JSON.stringify(new Map([['a',1]]))` gives `"{}"`. Why, and what breaks?
4. `todaysMeals` is an object, `dates` is a Map. One concrete reason for each.

## Dates

5. Why is `new Date(2026, 7, 3)` in August?
6. One line: how many days are in month `m` of year `y`?
7. Why must the week-strip builder create a fresh `Date` each iteration?
8. It's 8pm in New York. `toISOString().slice(0,10)` returns tomorrow. Explain the
   mechanism.
9. Your Map was keyed by `getDate()`. Name **two** distinct things that breaks.

## Arrays & derived data

10. `Array(7).map((_, i) => i)` returns 7 holes. `Array.from({length:7}, (_, i) => i)`
    returns `[0..6]`. Why?
11. Is `_` special syntax?
12. Give the one-sentence test for "state or computed during render?"
13. Your search box won't accept typing. What's missing, and why does React freeze it?

## Closures & refs

14. What object does `useRef(0)` return? What makes it different from `let x = 0` in
    the component body?
15. Why does the `latest` mirror effect have **no** dependency array?
16. When is `const id = setTimeout(...)` enough, and when do you genuinely need a ref?
17. You moved your counter into a ref. The screen never updates. Why?
18. StrictMode mounts → unmounts → mounts. What happens to an effect's `setTimeout`
    with no cleanup?

## App logic

19. Why `setCount(c => c + n)` over `setCount(count + n)`?
20. Write the condition for "just crossed the goal."
21. You store `count` **and** `todaysMeals[name].count`. Name two failure modes.
22. Name three situations a midnight `setTimeout` misses that a date-comparison
    catches.

## React & the DOM

23. `classname="data"` — what actually reaches the DOM, and why does no error appear?
24. `key` is on the `<ul>` but `.map()` returns a wrapping `<div>`. What's wrong?
25. Your `box-shadow` vanished entirely instead of rendering wrong. What's special
    about a `var()` that's invalid after substitution?

---
---

# Answers

<details>
<summary>Click only after answering all 25</summary>

1. Brackets look up a *property* on the Map object, not an entry. It returns
   `undefined` with no error, so the bug surfaces far from its cause. An exception
   would point at the line.
2. `.set()` returns the Map (chainable). `.delete()` returns a **boolean**. Returning
   `.delete()`'s result from an updater sets your state to `true`.
3. A Map's entries aren't own enumerable properties, so `stringify` sees an empty
   object. Saving to localStorage silently stores nothing. Use `JSON.stringify([...map])`.
4. Object: fits `{...spread}` updates and JSON-serializes directly. Map: dynamic keys
   added over time, `.size`, guaranteed insertion order, no prototype collisions.

5. Months are 0-indexed; days are 1-indexed. `7` is the 8th month.
6. `new Date(y, m + 1, 0).getDate()` — day 0 of the next month is the last of this one.
7. Date setters **mutate**. Reusing one object gives you 7 references to the same
   final value.
8. `toISOString` converts to UTC first. 8pm EDT is already past midnight UTC, so the
   date component belongs to the next day. Build keys from local getters instead.
9. (a) Collisions — Sep 3 and Aug 3 are both key `3`, so history overwrites itself.
   (b) Sort order — a week spanning a month boundary sorts `1,2,3,28,29,30,31`.

10. `Array(7)` is **sparse** — 7 holes, not 7 undefineds — and `.map()` skips holes.
    `Array.from` materializes them into real `undefined` values, so the callback runs.
11. No. It's an ordinary variable name, used by convention to mean "required
    parameter I'm ignoring."
12. If you can compute it from props and existing state during render, it isn't state.
13. `onChange` never called `setQuery`. A controlled input's value comes from state,
    so if state never changes, React re-renders the old value after every keystroke.

14. `{ current: 0 }` — the **same object** on every render. A `let` in the body is a
    fresh binding each render, so nothing persists.
15. It must run after *every* render to keep the mirror current. Any dep array would
    let it go stale — which is the exact bug it exists to fix.
16. A local `const` suffices when the same effect creates and clears the timer. You
    need a ref when the timer **re-arms itself** (the id changes) or when code outside
    the effect must cancel it.
17. Mutating a ref doesn't trigger a re-render. Refs are for values the UI doesn't
    display.
18. Two live timers, and only the second id is stored — so even adding cleanup later
    would leak the first. This is why StrictMode exists: it surfaces missing cleanup
    in dev.

19. The updater receives the current value as an argument, so it can't read a stale
    `count` from the closure. Direct arithmetic on a captured `count` is wrong the
    moment two updates batch.
20. `prev < goal && next >= goal`. Both halves — `next >= goal` alone is true forever
    after, which is why the popup kept reopening.
21. (a) They desync and nothing tells you which is right. (b) Every new code path has
    to remember to update both, so bugs scale with features.
22. Tab closed; machine asleep through midnight; browser restarted. Also: background-tab
    throttling, and sleeping through *several* days — the timer fires once and skips
    the rest with no record.

23. React doesn't recognize `classname` as a prop, so it forwards it to the DOM as a
    literal attribute: `<div classname="data">`. The element has no `class` at all, so
    the selector matches nothing. React does log an "Invalid DOM property" warning —
    it's easy to miss among others.
24. `key` must be on the outermost element `.map()` returns. On an inner element React
    can't use it for reconciliation, and you get the "unique key prop" warning.
25. A declaration containing `var()` that's invalid *after* substitution is "invalid at
    computed-value time." Unlike a normal syntax error — which is dropped so the
    previous cascade value wins — the property falls back to its initial/inherited
    value. `box-shadow` isn't inherited, so you get `none`.

</details>
