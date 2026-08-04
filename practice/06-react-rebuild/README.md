# 06 — Rebuild the app

Nothing new here. Every hard part is already solved in drills 01–05; this is
assembly. Build it in a **fresh** Vite app so you're not editing around existing
code:

```bash
npm create vite@latest tracker-rebuild -- --template react
cd tracker-rebuild && npm install
```

Copy your finished `01-maps`, `02-dates`, `03-arrays`, `05-app-logic` solutions into
`src/utils/` as you go. They're plain functions — they drop straight in.

Do the checkpoints **in order** and don't move on until the current one works.

---

## Checkpoint 1 — data, no UI

Build the `Menu` Map. Render nothing but a `<ul>` of food names.

```jsx
const Menu = new Map([
  ['chicken breast', { amount: 3.5, unit: 'oz', protein: 31 }],
  // ...
])
```

**The trap:** the Map constructor takes **one** argument — an array of pairs.
`new Map(['a', {...}], ['b', {...}])` throws *"Iterator value a is not an entry
object."*

**Prove it works:** all foods listed, no console errors.

> ❓ Why `[...Menu]` before `.map()`? What does spreading a Map give you?

---

## Checkpoint 2 — one component, props down

Extract `<Populate menu={[...Menu]} />`. It renders a card per food.

**The traps:** `className`, not `classname` — React forwards unknown lowercase
attributes to the DOM verbatim, so your CSS silently never matches. And `key` goes
on the **outermost** element returned from `.map()`.

**Prove it works:** no "unique key prop" warning, and a CSS class you write actually
applies.

> ❓ You add `.card { margin-top: 40px }` and nothing moves. Name three different
> causes, and how you'd tell them apart in DevTools.

---

## Checkpoint 3 — state and the updater form

Add `count` and `todaysMeals`. Wire up add/remove using `addMeal` / `removeMeal`
from drill 05.

```jsx
setCount(c => c + item.protein)     // NOT setCount(count + item.protein)
```

**The trap:** `count` is a `const` from destructuring. `setCount(...count += n)`
throws twice over — assignment to a constant, and spreading a non-iterable.

**Prove it works:** click a food 3×, the badge reads 3; remove 3×, the entry
disappears entirely.

> ❓ Why is the updater form safer than reading `count` from the closure?

---

## Checkpoint 4 — derived, not stored

Add the search box. Filter with `filterByQuery` from drill 03.

```jsx
const visible = menu.filter(...)    // during render. NOT useState + useEffect.
```

**The trap:** a controlled input needs `onChange={e => setQuery(e.target.value)}`.
Without the `setQuery` call the field is frozen and you cannot type in it.

Then **delete `count` as state** and derive it: `const count = totalProtein(todaysMeals)`.
One source of truth; the total can't drift from the meals.

**Prove it works:** typing filters instantly, no flash of an empty grid on load.

> ❓ Give the test for "should this be state, or computed during render?"

---

## Checkpoint 5 — the calendar

Add `dates` as state (`useState(() => new Map())`), and build the week strip and
month grid with `dayKey`, `lastNDays`, `daysInMonth`, `firstWeekdayOfMonth`,
`calendarCells`, `levelFor`.

**The traps:**
- `dates.get(key)` — **never** `dates[key]`. Brackets return `undefined` silently.
- Updaters must **return**: `setDates(prev => new Map(prev).set(k, v))`.
- Today is never in the Map (only midnight writes to it), so merge it from live state.
- Future days are not misses — render them blank, or the rest of the month reads as
  failure.

**Prove it works:** 7 cells always, even with no data; today's cell shows your live
total.

> ❓ Why iterate the calendar and look *up* the Map, rather than iterating the Map?

---

## Checkpoint 6 — refs and the timer

Add the midnight rollover with `timerId` and `latest` refs.

```jsx
const timerId = useRef(null)
const latest  = useRef({ count, todaysMeals })
useEffect(() => { latest.current = { count, todaysMeals } })   // no dep array
```

**The traps:** hooks only at the **top level** — never inside a nested function.
Return a cleanup that calls `clearTimeout`. Re-arm inside the callback. Pass a
**number** to `setTimeout`, not `[ms]`.

**Prove it works:** temporarily set the delay to 5000ms and watch a day archive
itself, then archive again 5s later. That second archive is the re-arm — the thing
your original never did.

> ❓ Your app records `protein: 0` every night. Explain the mechanism in one sentence.

---

## Checkpoint 7 — persistence

The step your real app still doesn't have. Save to `localStorage` on change,
rehydrate in the `useState` initializer, and roll over with `rollOver` from drill 05
**on load and on `visibilitychange`** — not on a timer.

```jsx
const [dates, setDates] = useState(() => {
  const saved = localStorage.getItem('dates')
  return saved ? deserializeMap(saved) : new Map()
})
```

**The trap:** `JSON.stringify(map)` gives `"{}"`. Use `serializeMap` from drill 01.

**Prove it works:** log food, refresh the page, it's still there. Then change your
system clock forward a day and reload — yesterday should appear in the calendar
without the app having been open at midnight.

> ❓ Why is comparing dates on wake strictly better than a `setTimeout`?
> Name three situations the timer misses.

---

## When you're done

Compare against `MyFitnessPal/src/`. Where you did it differently, work out which
version is better — sometimes it'll be yours. Then go answer `QUIZ.md` cold.
