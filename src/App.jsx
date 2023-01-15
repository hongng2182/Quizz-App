import { useState } from 'react'
import IntroPage from './components/IntroPage'
import './css/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <IntroPage />
    </div>
  )
}

export default App
