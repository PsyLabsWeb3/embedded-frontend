import { Link } from 'react-router-dom'
import EmbeddedGame from '../components/games/Embedded'
import './Snake2048Page.css'

function EmbeddedGamePage() {
  return (
    <div className="snake2048-page">
      <div className="page-header">
        <Link to="/" className="back-button">
          ← Volver al inicio
        </Link>
        <h1>Embedded Game</h1>
      </div>
      
      <div className="game-container">
        <EmbeddedGame />
      </div>
      
      <div className="game-info">
        <h3>Instrucciones:</h3>
        <ul>
          <li>Usa las flechas del teclado para mover la serpiente</li>
          <li>Combina números iguales para crear números más grandes</li>
          <li>Evita chocar con las paredes o contigo mismo</li>
          <li>¡Intenta alcanzar el número 2048!</li>
        </ul>
      </div>
    </div>
  )
}

export default EmbeddedGamePage