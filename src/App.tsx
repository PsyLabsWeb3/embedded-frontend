import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Snake2048Page from './pages/Snake2048Page'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake2048" element={<Snake2048Page />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
