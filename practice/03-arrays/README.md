# 03 — Arrays & derived data

## Concept A: `Array.from({ length: n }, (_, i) => ...)`

JavaScript has no `range()`. This is the idiom.

```js
Array.from({length: 7})                      // [undefined × 7]
Array.from({length: 7}, (el, i) => i)        // [0,1,2,3,4,5,6]
```

Two pieces:

- **`{length: 7}` is an "array-like."** Not an array — a plain object with a
  `length`. `Array.from` reads `.length`, then asks for keys `0..6`, gets
  `undefined` for each.
- **`(_, i)`** is the map callback, signature `(element, index)`. Every element is
  `undefined`, so it's named `_` — **a convention meaning "I must accept this but
  I'm ignoring it."** Not syntax. You could call it `whatever`.

### The trap

```js
Array(7).map((_, i) => i)        // [ <7 empty items> ]  ← callback NEVER runs
[...Array(7)].map((_, i) => i)   // [0,1,2,3,4,5,6]      ← works
```

`Array(7)` makes a **sparse** array — 7 *holes*, not 7 undefineds. `.map()` skips
holes. Spreading or `Array.from` materializes them into real values.

## Concept B: derived data is not state

If you can compute it from props and existing state during render, **it isn't state.**

```js
// ✗ what you had
const [visible, setVisible] = useState([])
useEffect(() => { setVisible(menu.filter(...)) }, [query])

// ✓
const visible = menu.filter(...)
```

The broken version had three problems: the effect's deps were missing `menu`, the
first render showed an empty grid before the effect filled it, and every keystroke
cost two renders instead of one.

The rule generalizes: **the fewer independent pieces of state, the fewer ways they
can disagree.** Two states that must stay in sync will eventually drift.

## Questions

1. Why does `Array(7).map(...)` return holes when `Array.from({length:7}, ...)` works?
2. What does `_` mean, and is it special to JavaScript?
3. Give the test for "should this be state or computed during render?"
4. `menu.filter(([name]) => ...)` — why the brackets inside the parameter?
5. Your search box was a controlled input that couldn't be typed in. What single
   thing was missing, and why does React "freeze" the field without it?
