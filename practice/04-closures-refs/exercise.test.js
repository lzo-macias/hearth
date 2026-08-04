import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeCounter, makeStaleReader, makeBox, makeScheduler, startRepeating } from './exercise.js'

test('makeCounter — a closure reads the live variable', () => {
  const c = makeCounter()
  assert.equal(c.get(), 0)
  c.inc(); c.inc(); c.inc()
  assert.equal(c.get(), 3)
})

test('makeCounter instances are independent', () => {
  const a = makeCounter(), b = makeCounter()
  a.inc()
  assert.equal(a.get(), 1)
  assert.equal(b.get(), 0)
})

test('makeStaleReader reproduces the stale-closure bug', () => {
  const s = makeStaleReader(1)
  assert.equal(s.read(), 1)
  s.update(99)
  assert.equal(s.read(), 1, 'this is your midnight callback: frozen at creation')
})

test('makeBox — same object identity every time', () => {
  const box = makeBox(0)
  const read = () => box.current      // captured before the write
  box.current = 42
  assert.equal(read(), 42, 'the box contents changed, the box did not')
  assert.equal(typeof box, 'object')
  assert.ok('current' in box, 'useRef(x) returns exactly { current: x }')
})

test('makeScheduler — a callback created early still sees the newest value', () => {
  const s = makeScheduler(0)
  let recorded = null
  s.schedule(() => { recorded = s.latest.current })   // created NOW
  s.latest.current = 196                              // changes LATER
  s.tick()
  assert.equal(recorded, 196, 'without the box this would record 0 — your blank day')
})

test('makeScheduler — the buggy version, for contrast', () => {
  const s = makeScheduler(0)
  let recorded = null
  const frozen = s.latest.current                     // reads the VALUE now
  s.schedule(() => { recorded = frozen })
  s.latest.current = 196
  s.tick()
  assert.equal(recorded, 0, 'capturing the value instead of the box loses the update')
})

// A fake clock so timing is deterministic — no real waiting.
function makeFakeClock() {
  let nextId = 1
  const pending = new Map()
  return {
    setTimeout(fn, ms) { const id = nextId++; pending.set(id, { fn, ms }); return id },
    clearTimeout(id) { pending.delete(id) },
    runNext() {
      const [id, entry] = [...pending.entries()][0] ?? []
      if (!entry) return false
      pending.delete(id)
      entry.fn()
      return true
    },
    pendingCount() { return pending.size },
  }
}

test('startRepeating runs fn and re-arms', () => {
  const clock = makeFakeClock()
  let runs = 0
  startRepeating(clock, 1000, () => { runs++ })
  assert.equal(clock.pendingCount(), 1, 'should be armed immediately')

  clock.runNext()
  assert.equal(runs, 1)
  assert.equal(clock.pendingCount(), 1, 'must RE-ARM — yours only ever fired once')

  clock.runNext()
  assert.equal(runs, 2)
})

test('startRepeating cancel() clears the pending timeout', () => {
  const clock = makeFakeClock()
  let runs = 0
  const cancel = startRepeating(clock, 1000, () => { runs++ })
  cancel()
  assert.equal(clock.pendingCount(), 0)
  assert.equal(clock.runNext(), false)
  assert.equal(runs, 0)
})

test('cancel() clears the CURRENT id, not the original one', () => {
  const clock = makeFakeClock()
  const cancel = startRepeating(clock, 1000, () => {})
  clock.runNext()             // fires once and re-arms with a NEW id
  cancel()                    // must clear that new id, not the stale first one
  assert.equal(clock.pendingCount(), 0, 'this is exactly why the id lives in a ref')
})
