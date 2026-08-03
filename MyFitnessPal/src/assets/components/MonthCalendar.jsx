import { useState } from 'react'
import { dayKey } from '../../utils/date'
import { levelFor, entryFor } from '../../utils/goal'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MonthCalendar({ dates, goal, totalProtein, todaysMeals }) {
  const today = new Date()
  const todayKey = dayKey(today)

  // Which month is on screen. Always the 1st, so month arithmetic is clean.
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  // getDay() on the 1st = how many blank cells before the month starts.
  const leadingBlanks = new Date(year, month, 1).getDay()
  // Day 0 of the NEXT month is the last day of this one — no leap-year math.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()

  const days = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  )

  const live = { totalProtein, todaysMeals, goal }

  // Month summary — only counts days that have actually happened.
  const logged = days.filter(
    (d) => d <= today && entryFor(dates, dayKey(d), todayKey, live)
  )
  const hit = logged.filter(
    (d) => entryFor(dates, dayKey(d), todayKey, live)?.pass
  ).length

  const shiftMonth = (delta) =>
    setCursor(new Date(year, month + delta, 1))

  return (
    <section className="monthCal">
      <header className="monthCalHead">
        <button
          className="monthNav"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>

        <div className="monthCalTitle">
          <h3>{cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <p className="monthCalSummary">
            {logged.length
              ? `${hit} of ${logged.length} ${logged.length === 1 ? 'day' : 'days'} hit`
              : 'no days logged'}
          </p>
        </div>

        <button
          className="monthNav"
          onClick={() => shiftMonth(1)}
          // Nothing to show past the current month — every cell would be blank.
          disabled={isCurrentMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </header>

      <div className="monthGrid" role="grid">
        {WEEKDAYS.map((d, i) => (
          // Two days start with the same letter, so the key is the index.
          <div key={i} className="weekdayHead" aria-hidden="true">
            {d}
          </div>
        ))}

        {/* Empty cells so the 1st lands under the right weekday. */}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} className="calCell blank" />
        ))}

        {days.map((date) => {
          const key = dayKey(date)
          const entry = entryFor(dates, key, todayKey, live)
          const isFuture = date > today
          // A day that hasn't happened yet is not a missed day — render it
          // blank rather than as a zero, or the rest of the month reads as failure.
          const level = isFuture ? 0 : levelFor(entry?.protein, goal)

          return (
            <div
              key={key}
              role="gridcell"
              className={[
                'calCell',
                `lvl${level}`,
                key === todayKey ? 'isToday' : '',
                isFuture ? 'isFuture' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title={
                isFuture
                  ? date.toDateString()
                  : `${date.toDateString()} — ${entry ? `${entry.protein}g of ${goal}g` : 'no data'}`
              }
            >
              <span className="calDayNum">{date.getDate()}</span>
              {/* Secondary encoding: goal-met never rests on color alone. */}
              {entry?.pass && <span className="calCheck" aria-label="goal met">✓</span>}
            </div>
          )
        })}
      </div>

      {/* A sequential ramp is unreadable without its scale. */}
      <div className="legend">
        <span className="legendLabel">less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={`legendSwatch lvl${l}`} />
        ))}
        <span className="legendLabel">goal</span>
      </div>
    </section>
  )
}

export default MonthCalendar
