export function makeCounter() {
  let count = 0                       // one binding; both closures share it
  return { inc: () => { count++ }, get: () => count }
}

// The bug, on purpose: `read` closes over the PARAMETER, which update never touches.
export function makeStaleReader(initial) {
  let updated = initial
  return {
    read: () => initial,              // frozen at creation — your midnight callback
    update: (v) => { updated = v },   // writes somewhere `read` cannot see
  }
}

// useRef(x) is precisely this: one object, stable identity, mutable contents.
export const makeBox = (initial) => ({ current: initial })

export function makeScheduler(initialValue) {
  const latest = makeBox(initialValue)
  let scheduled = null
  return {
    latest,
    schedule: (fn) => { scheduled = fn },
    tick: () => { scheduled?.() },
  }
}

export function startRepeating(clock, ms, fn) {
  const id = makeBox(null)            // must be a box: the id changes on every re-arm
  const arm = () => {
    id.current = clock.setTimeout(() => {
      fn()
      arm()                           // re-arm for the next interval
    }, ms)
  }
  arm()
  return () => clock.clearTimeout(id.current)   // clears whichever is CURRENTLY pending
}
