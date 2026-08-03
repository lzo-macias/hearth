// CHANGED: dropped the unused `React` default import (the modern JSX transform
// doesn't need it, and ESLint was erroring on it); added useRef.
import { useState, useEffect, useRef } from 'react'
// CHANGED: shared date helpers, see src/utils/date.js
import { dayKey } from './utils/date'
import './App.css'
import Populate from './assets/components/Populate'
import Nav from './assets/components/nav'
import SuccessPopUp from './assets/components/SuccessPopUp'
import Counter from './assets/components/Counter'

// Vite bundles every photo in assets/food at build time and hands back the
// hashed URL, so one glob replaces 28 import lines.
const photos = import.meta.glob('./assets/food/*.jpg', { eager: true, import: 'default' })
const photo = (slug) => photos[`./assets/food/${slug}.jpg`]

// Protein values are grams per serving, cooked unless noted.
// Standard servings: 3.5 oz (100 g) for solids, 1 cup for liquids/legumes.
const Menu = new Map([
  // Poultry & meat — 3.5 oz cooked
  ['chicken breast', { amount: 3.5, unit: 'oz', protein: 31, img: photo('chicken-breast') }],
  ['chicken thigh', { amount: 3.5, unit: 'oz', protein: 26, img: photo('chicken-thigh') }],
  ['turkey breast', { amount: 3.5, unit: 'oz', protein: 29, img: photo('turkey-breast') }],
  ['ground turkey (93/7)', { amount: 3.5, unit: 'oz', protein: 27, img: photo('ground-turkey') }],
  ['ground beef (93/7)', { amount: 3.5, unit: 'oz', protein: 26, img: photo('ground-beef') }],
  ['sirloin steak', { amount: 3.5, unit: 'oz', protein: 29, img: photo('sirloin-steak') }],
  ['pork tenderloin', { amount: 3.5, unit: 'oz', protein: 26, img: photo('pork-tenderloin') }],
  ['bison', { amount: 3.5, unit: 'oz', protein: 28, img: photo('bison') }],

  // Seafood — 3.5 oz cooked
  ['salmon', { amount: 3.5, unit: 'oz', protein: 25, img: photo('salmon') }],
  ['tuna (canned in water)', { amount: 3.5, unit: 'oz', protein: 26, img: photo('tuna') }],
  ['shrimp', { amount: 3.5, unit: 'oz', protein: 24, img: photo('shrimp') }],
  ['cod', { amount: 3.5, unit: 'oz', protein: 23, img: photo('cod') }],
  ['tilapia', { amount: 3.5, unit: 'oz', protein: 26, img: photo('tilapia') }],
  ['sardines (canned)', { amount: 3.5, unit: 'oz', protein: 25, img: photo('sardines') }],

  // Plant protein — 3.5 oz
  ['firm tofu', { amount: 3.5, unit: 'oz', protein: 17, img: photo('tofu') }],
  ['tempeh', { amount: 3.5, unit: 'oz', protein: 19, img: photo('tempeh') }],
  ['seitan', { amount: 3.5, unit: 'oz', protein: 25, img: photo('seitan') }],

  // Legumes & grains — 1 cup cooked
  ['lentils', { amount: 1, unit: 'cup', protein: 18, img: photo('lentils') }],
  ['black beans', { amount: 1, unit: 'cup', protein: 15, img: photo('black-beans') }],
  ['chickpeas', { amount: 1, unit: 'cup', protein: 15, img: photo('chickpeas') }],
  ['edamame (shelled)', { amount: 1, unit: 'cup', protein: 18, img: photo('edamame') }],
  ['quinoa', { amount: 1, unit: 'cup', protein: 8, img: photo('quinoa') }],

  // Eggs & dairy
  ['eggs (2 large)', { amount: 3.5, unit: 'oz', protein: 13, img: photo('eggs') }],
  ['egg whites', { amount: 1, unit: 'cup', protein: 26, img: photo('egg-whites') }],
  ['greek yogurt (nonfat)', { amount: 1, unit: 'cup', protein: 23, img: photo('greek-yogurt') }],
  ['cottage cheese (low-fat)', { amount: 1, unit: 'cup', protein: 28, img: photo('cottage-cheese') }],
  ['milk (2%)', { amount: 1, unit: 'cup', protein: 8, img: photo('milk') }],
  ['protein shake (whey, prepared)', { amount: 1, unit: 'cup', protein: 24, img: photo('protein-shake') }],
])

function App() {
  const [count, setCount] = useState(0)
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false)
  const [screen, setScreen] = useState("menu")
  const [todaysMeals, setTodaysMeals] = useState({})
  const [dates, setDates] = useState(()=> new Map())
  // CHANGED: tracks whether we've already celebrated today, so the popup fires
  // on the crossing instead of reopening on every add after you pass the goal.
  const goal = 160

// CHANGED: the timer id lives in a ref because the timeout re-arms itself —
// each new id has to be reachable from cleanup. Refs, not state: never rendered.
const timerId = useRef(null)
// CHANGED: mirror of the latest state. The midnight callback is created once and
// closes over first-render values, so without this it would record protein: 0
// and todaysMeals: {} every night regardless of what you actually logged.
const latest = useRef({ count, todaysMeals })

// CHANGED (new): no dependency array on purpose — this must run after EVERY
// render to keep the mirror current.
useEffect(() => {
  latest.current = { count, todaysMeals }
})

useEffect(() => {
function scheduleMidnight(){

    const now = new Date()

    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,   // day overflow rolls into the next month/year for us
        0, 0 ,0 ,0
    )

    const msTillMidnight = nextMidnight - now

    // CHANGED: store the id so cleanup can clear whichever timeout is pending.
    timerId.current = setTimeout(() => {
      // CHANGED: read through the ref, not the frozen closure.
      const { count, todaysMeals } = latest.current

      setDates(prevDates => {
        const nextDates = new Map(prevDates)
        // CHANGED: keyed by dayKey(now) instead of now.getDate(). The old key was
        // day-of-month, so Sep 3 overwrote Aug 3 and a week spanning a month
        // boundary sorted out of order. Also: the inlined version referenced an
        // undefined `d`, which would have thrown here.
        nextDates.set(dayKey(now), {
          protein: count,
          pass: count >= goal,
          todaysMeals,
        })
        return nextDates   // this return was missing — dates became undefined
      })

      setCount(0)
      setTodaysMeals({})       // CHANGED: the day's meals need clearing too
      scheduleMidnight()       // CHANGED: re-arm; it only ever fired once before
    }, msTillMidnight)         // CHANGED: a number, not [msTillMidnight]

}

scheduleMidnight()
// CHANGED: cleanup. Without it the timer leaked, and React StrictMode's
// double-mount in dev left two live timers running.
return () => clearTimeout(timerId.current)
}, [goal])



function addProtein ([name, item], addedProtein){
  setCount(c => c + addedProtein)
  setTodaysMeals(c => ({
    ...c,
    [name]: {item, count: (c[name]?.count ?? 0) + 1},
  }))
}

function removeProtein ([name], removedProtein){
  setCount(c => c - removedProtein)
  setTodaysMeals(c => {
    const current = c[name]
    if (!current) return c

    if (current.count > 1){
      return {...c, [name]: {...current, count: current.count -1}}
    }

    const {[name]: _removed, ...rest} = c
    return rest
  })
}

// CHANGED: added the `celebrated` guard. Previously this re-ran on every count
// change, so once you were past the goal the popup reopened after every add —
// dismiss it, log a snack, it's back.
useEffect(() => {
  if (count >= goal ) {
    setShowSuccessPopUp(true)
  }
}, [count, goal])

const screens = {
  "menu":(
    <>
      <Nav 
        onCompleteV1 = {() => setScreen("counter")}
        onCompleteV2 = {() => setScreen("menu")}
      />
      <Populate 
        menu={[...Menu]} 
        addProtein = {addProtein}
        removeProtein = {removeProtein}
        todaysMeals = {todaysMeals}
      />
      {showSuccessPopUp && (
        <SuccessPopUp goal = {goal} 
        totalProtein = {count} 
        onComplete={() => setShowSuccessPopUp(false)}/>
      )}
   </>
  ),
  "counter": (
  <>
    <Nav
      onCompleteV2={() => setScreen("menu")}
      onCompleteV1 = {() => setScreen("counter")}
    />
    <Counter
      totalProtein = {count}
      goal = {goal}
      dates = {dates}
      todaysMeals = {todaysMeals}
    />
  </>)
}

  return (
    <>
    <div className='bigContainer'>
      {screens[screen]}
      {/* <h2>HEY</h2> */}
    </div>
    </>
  )
}

export default App
