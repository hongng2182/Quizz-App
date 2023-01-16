import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IntroPage from './components/IntroPage'
import Questions from './components/Questions'
import NoPage from './components/NoPage'
import './css/App.css'

function App() {
  return (
    < BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" index element={<IntroPage />} />
          <Route path="questions" element={<Questions />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
