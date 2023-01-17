import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IntroPage from './components/IntroPage'
import Questions from './components/Questions'
import NoPage from './components/NoPage'
import TopicChosen from './components/TopicChosen'
import './css/App.css'



function App() {
  return (
    < BrowserRouter>
      <Routes>
        <Route path="/" index element={<IntroPage />} />
        <Route exact path="questions" element={<Questions />} />
        <Route path="select" element={<TopicChosen />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
