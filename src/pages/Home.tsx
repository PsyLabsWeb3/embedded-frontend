import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <h1>🎮 Embedded Games</h1>
        <p>Bienvenido a nuestra colección de juegos embebidos</p>
        
        <div className="games-grid">
          <Link to="/snake2048" className="game-card">
            <div className="game-icon">🐍</div>
            <h3>Snake 2048</h3>
            <p>Combina la mecánica del Snake con el 2048</p>
          </Link>
          
          {/* Futuros juegos pueden agregarse aquí */}
          <div className="game-card coming-soon">
            <div className="game-icon">🎲</div>
            <h3>Más juegos</h3>
            <p>Próximamente...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 