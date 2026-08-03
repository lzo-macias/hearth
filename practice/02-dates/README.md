# 02 — Dates

## The concept

**A `Date` is one number: milliseconds since Jan 1 1970 UTC.** Years, months and
weekdays are all computed from it on demand. Once that clicks, most of the weirdness
follows logically.

```js
new Date(2026, 7, 3).valueOf()   // 1785729600000
```

That's also why `nextMidnight - now` gives you milliseconds — subtraction coerces
both to numbers.

### The five rules

**1. Months are 0-indexed. Days are 1-indexed.**
```js
new Date(2026, 7, 3)   // Mon Aug 03 2026 — 7 is AUGUST
```
Inconsistent, universally annoying, never going to change.

**2. `getDate()` ≠ `getDay()`**
```js
d.getDate()   // 3   day of month, 1–31
d.getDay()    // 1   day of week, 0=Sunday
```
Your original `dates` Map was keyed on `getDate()` — day of month. That's why
September 3rd would overwrite August 3rd, and why a week spanning a month boundary
sorted as `1, 2, 3, 28, 29, 30, 31`.

**3. Overflow rolls over — and this is a feature.**
```js
d.setDate(d.getDate() - 6)   // walks back into the previous month automatically
new Date(2026, 7, 0)         // day 0 = Jul 31 (last day of the previous month)
new Date(2026, 0, 32)        // Feb 1
```
You never do calendar arithmetic yourself. `daysInMonth` is just "day 0 of next month."

**4. Setters mutate.**
```js
const a = new Date(2026, 7, 3)
const b = a
a.setDate(1)      // b changed too — same object
```
Which is why the week-strip builder creates a fresh `new Date()` every iteration.

**5. Local vs UTC are different worlds.** Every getter has a UTC twin.
`toISOString()` **always converts to UTC**, so:

```js
// 8pm on Aug 3 in New York:
new Date().toISOString().slice(0, 10)   // "2026-08-04"  ← WRONG DAY
```

That's why `dayKey` is built from `getFullYear`/`getMonth`/`getDate` by hand.

## Questions — answer before you code

1. Why is `new Date(2026, 7, 3)` in August and not July?
2. Give the one-line expression for "how many days are in month `m` of year `y`."
3. Why does the week-strip builder create a new `Date` inside the loop instead of
   reusing one and calling `setDate` on it?
4. You're in New York at 8pm. `toISOString().slice(0,10)` gives tomorrow's date.
   Explain the mechanism, not just the fix.
5. `msUntilMidnight` returns roughly 57,600,000. Your machine sleeps for two days.
   What actually happens to a `setTimeout` with that delay — and which day gets
   recorded?

## Your task

Every function takes the "current" date as an argument instead of calling
`new Date()` internally. That's deliberate — it's what makes them testable. Code
that reads the clock directly can't be tested at all.
