import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import WorkDetailPage from './pages/WorkDetailPage'
import WorkWritePage from './pages/WorkWritePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/work/write" element={<WorkWritePage />} />
      <Route path="/work/:id" element={<WorkDetailPage />} />
    </Routes>
  )
}

export default App
