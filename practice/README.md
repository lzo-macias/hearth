# Practice — rebuild the protein tracker from its concepts

Every drill here is derived from a **real bug in your app**. Not invented exercises —
the actual mistakes, isolated so you can see the concept underneath.

## How to run

```bash
cd practice
npm test              # all 60 tests
npm run test:watch    # re-runs as you save — leave this open while you work
```

Zero dependencies — Node 22 has a test runner built in. There is nothing to install.

To run one topic:

```bash
cd practice
node --test "01-maps/*.test.js"
```

> Use the quoted glob, not `node --test 01-maps/`. Passing a bare directory makes
> Node try to *execute* it instead of searching it, and you get a confusing
> `MODULE_NOT_FOUND`.

You should see **60 tests, 60 failing** on your first run. That's correct — every
exercise is a stub that throws.

Every test **fails at first** — the exercise files are stubs that throw `TODO`.
Your job is to make them pass. Solutions are in `practice/solutions/`, but read the
topic's `README.md` first and try before opening them.

## The order

| # | Topic | The concept | The bug it caused |
|---|---|---|---|
| 01 | **Maps** | `Map` is not an object | `dates[key]` and `dates(key)` — both silently wrong |
| 02 | **Dates** | a Date is a number; months are 0-indexed | keying by `getDate()` made Sep 3 overwrite Aug 3 |
| 03 | **Arrays & derived data** | compute, don't store | `visible` as state + effect caused an empty first render |
| 04 | **Closures & refs** | a closure captures a *binding*, not a snapshot | midnight recorded `protein: 0` every night |
| 05 | **App logic** | state transitions as pure functions | `setCount(...count += x)` and the popup that wouldn't close |
| 06 | **React rebuild** | put it back together | — |

Do them in order. 03 depends on 02, and 05 depends on all of them.

## How to use each topic

1. Read `NN-topic/README.md` — the concept, and the questions to answer *before* coding.
2. Open `NN-topic/exercise.js` — implement the stubs.
3. Run `node --test practice/NN-topic/` until green.
4. Compare against `practice/solutions/NN-topic.js`.
5. Answer that topic's questions in `QUIZ.md` out loud, without looking.

The questions matter more than the code. If you can make a test pass but can't say
*why* it failed before, you've learned the fix and not the concept — and the next
version of that bug will look brand new to you.

## When you're done

`06-react-rebuild/README.md` walks you through rebuilding the app component by
component, using the functions you wrote in drills 01–05. Nothing in it is new —
it's assembly.
