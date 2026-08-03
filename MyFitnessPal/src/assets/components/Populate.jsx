// CHANGED: dropped the unused `React` import and `useEffect` (no longer needed —
// see the `visible` change below).
import {useState} from 'react'
import "./Populate.css"

// `menu` arrives as the Menu map spread into [name, data] pairs: [...Menu]
// Destructuring the pair gives the name and the record directly, so there's
// no key lookup to do inside the loop.
function Populate({menu, addProtein, todaysMeals, removeProtein}) {
    const [query, setQuery] = useState("")

function handleAddToTracker([name, item], amt){
    addProtein([name, item], amt)
}

function handleRemoveFromTracker([name], amt){
    removeProtein([name], amt)
}

// CHANGED: was `const [visible, setVisible] = useState([])` plus a useEffect that
// called setVisible. Two problems with that: the effect's deps were missing
// `menu`, and on mount it rendered an empty grid first and only filled it on the
// second render. This is derived from props + state, so it's computed during
// render — no state, no effect, no flash.
const visible = menu.filter(([name]) =>
    name.toLowerCase().includes(query.toLowerCase())
)

  return (
    <div className='mainContainer'>
        <div>
            <form className='formContainer' action="submit">
                <label htmlFor="">Search</label>
                <input type="text" value = {query} onChange ={(e) => setQuery(e.target.value)}/>
            </form>
        </div>
        <div className='menu'>
            {visible.map(([name, item], i) => (
                <div key={name} className='itemContainer'>
                    <ul>
                        <img
                            src={item.img} 
                            alt={`image of ${name}`}
                            loading={i < 6 ? "eager" : "lazy"}
                            fetchPriority = {i < 6 ? "high" : "auto"}
                            className='itemImage'

                        />
                        <div className = "data">
                            <li className='Name'>{name}</li>
                            <li>
                                {item.amount} {item.unit}
                            </li>
                            <li>protein: {item.protein}g</li>
                        </div>
                    </ul>
                {/* CHANGED (in the else-branch below): was
                    handleAddToTracker([name], ...) — missing `item`. That is the
                    branch that CREATES the entry (first click on a food), so
                    every food was stored as {item: undefined, count: 1} until
                    you clicked it a second time. */}
                {todaysMeals[name] ? (
                    <div className='btnstogetehr'>
                        <span className='amtof'>{todaysMeals[name].count}</span>
                        <button onClick={()=>handleAddToTracker([name, item], item.protein)} className='addbtn'>Add to today</button>
                        <button onClick={()=>handleRemoveFromTracker([name],item.protein)}>Remove from today</button>
                    </div>
                )
                :(<button onClick={()=>handleAddToTracker([name, item],item.protein)}>Add to today</button>)
            }
                </div>
            ))}
        </div>

    </div>
  )
}

export default Populate
