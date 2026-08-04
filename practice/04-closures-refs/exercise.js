// 04 — Closures & refs.  Run: node --test practice/04-closures-refs/
// No React here on purpose. useRef is a closure workaround; build it by hand first.

/**
 * Returns { inc, get }. inc() adds 1, get() returns the running total.
 * Warm-up: proves a closure can read a variable that changes after capture.
 */
export function makeCounter() {
  throw new Error('TODO: makeCounter')
}

/**
 * DEMONSTRATES THE BUG — implement it so it stays broken.
 * Returns a function that reports the value passed in at CREATION time,
 * even if you later call the returned object's .update().
 *
 *   const s = makeStaleReader(1)
 *   s.update(99)
 *   s.read()      // 1   <- frozen, like your midnight callback
 *
 * Return { read, update } where update reassigns a local that `read` does NOT see.
 * Hint: `read` must close over the PARAMETER; `update` writes to a different variable.
 */
export function makeStaleReader(initial) {
  throw new Error('TODO: makeStaleReader')
}

/**
 * THE FIX — a ref by hand. This is literally what useRef gives you.
 * Returns an object with a `current` property.
 *   const box = makeBox(0)
 *   const read = () => box.current    // captured NOW
 *   box.current = 42
 *   read()   // 42
 */
export function makeBox(initial) {
  throw new Error('TODO: makeBox')
}

/**
 * Returns { schedule, tick, latest }.
 *   - latest is a box (from makeBox) holding the current value
 *   - schedule(fn) stores a callback to run later
 *   - tick() runs the stored callback with NO arguments
 * The callback must be able to read the newest value via the box, even though it
 * was created before the value changed. This is the midnight timer in miniature.
 */
export function makeScheduler(initialValue) {
  throw new Error('TODO: makeScheduler')
}

/**
 * Start a repeating "timer" and return a cancel function.
 * `clock` is an injected fake: clock.setTimeout(fn, ms) -> id, clock.clearTimeout(id).
 *
 * Behaviour:
 *   - schedule fn to run after `ms`
 *   - after it runs, RE-ARM it for another `ms` (this is why an id must be tracked)
 *   - the returned cancel() clears whichever timeout is currently pending
 *
 * BUG THIS DRILLS: your effect stored timerId but never cleared it, and never re-armed.
 */
export function startRepeating(clock, ms, fn) {
  throw new Error('TODO: startRepeating')
}
