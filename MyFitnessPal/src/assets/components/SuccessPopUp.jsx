// CHANGED: removed the unused `React` import (same reason as Nav.jsx).
function SuccessPopUp({goal, totalProtein, onComplete}) {
  return (
    <div>
        <button onClick={() => onComplete()}></button>
        <h2>Congrats on Meeting Your Protein Goal today!</h2>
        <p>{`you hit ${totalProtein} grams of protein out of ${goal}`}</p>
    </div>
  )
}

export default SuccessPopUp