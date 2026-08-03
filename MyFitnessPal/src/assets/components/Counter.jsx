import { dayKey, lastNDays } from '../../utils/date'
// CHANGED: level/entry logic moved to utils/goal.js so the week strip and the
// new month calendar share one set of thresholds and one color meaning.
import { levelFor, entryFor } from '../../utils/goal'
import MonthCalendar from './MonthCalendar'
import './Counter.css'

//i need past 7 days        <- the week strip
//month to month            <- MonthCalendar, below the strip
//running average on succes <- daysHit + the month summary
function Counter({totalProtein, goal, dates, todaysMeals}) {
  const beatGoal = totalProtein >= goal

  const lastSevenDays = lastNDays(7)
  const todayKey = dayKey(new Date())
  const live = { totalProtein, todaysMeals, goal }

  const daysHit = lastSevenDays.filter(
    (date) => entryFor(dates, dayKey(date), todayKey, live)?.pass
  ).length

  // Capped so going over the goal doesn't overflow the bar.
  const pctOfGoal = Math.min((totalProtein / goal) * 100, 100)

  return (
    <div className='counter'>
        <div className='counterHead'>
            <p className='heroNumber'>
              {totalProtein}<span className='heroUnit'>g</span>
            </p>

            {beatGoal
              ? <p className='heroSub met'>goal met — {goal}g cleared</p>
              : <p className='heroSub'>{goal - totalProtein}g left to go</p>}

            <div className='goalBar'>
              <div
                className={beatGoal ? 'goalBarFill met' : 'goalBarFill'}
                style={{ width: `${pctOfGoal}%` }}
              />
            </div>

            <p className='streak'>{daysHit}/7 days hit this week</p>
        </div>

        <section className='weekSection'>
          <p className='weekLabel'>Past 7 days</p>
          <div className='week'>
              {lastSevenDays.map((date) => {
                // `date` comes from lastSevenDays — it says WHICH day this cell
                // is. The Map says WHAT happened. dayKey is the bridge.
                const key = dayKey(date)
                const entry = entryFor(dates, key, todayKey, live)
                const level = levelFor(entry?.protein, goal)

                return (
                  <div
                    key = {key}
                    // CHANGED: was className='' — now carries the ramp step, so
                    // the strip and the month grid encode identically.
                    className={`day lvl${level}${key === todayKey ? ' isToday' : ''}`}
                    title={`${date.toDateString()} — ${
                      entry ? `${entry.protein}g of ${goal}g` : 'no data'
                    }`}
                  >
                    <span className='dayName'>
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className='dayNum'>{date.getDate()}</span>
                    <span className='dayValue'>
                      {entry ? `${entry.protein}g` : '—'}
                    </span>
                    {/* Secondary encoding — goal-met is never color-alone. */}
                    {entry?.pass && <span className='dayCheck'>✓</span>}
                  </div>
                )
              })}
          </div>
        </section>

        {/* CHANGED (new): month-over-month view, directly beneath the strip. */}
        <MonthCalendar
          dates={dates}
          goal={goal}
          totalProtein={totalProtein}
          todaysMeals={todaysMeals}
        />
    </div>
  )
}

export default Counter
