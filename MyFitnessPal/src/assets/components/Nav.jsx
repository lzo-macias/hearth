// CHANGED: removed the unused `React` import — the modern JSX transform doesn't
// need it in scope, and ESLint was erroring on it.
import "./navstyling.css"

function Nav({onCompleteV1, onCompleteV2}) {
  return (
    <nav className='nav'>
        <button onClick={()=> onCompleteV1()}>counter</button>
        <button onClick={()=> onCompleteV2()}>menu</button>
    </nav>
  )
}

export default Nav