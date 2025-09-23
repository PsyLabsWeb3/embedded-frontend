// Predefined game content configurations for easy reuse
import type { ComponentProps } from 'react';
import GameCustomContent from '../components/games/GameCustomContent';

type GameCustomContentProps = ComponentProps<typeof GameCustomContent>;

export const gameContentConfigs: Record<string, Omit<GameCustomContentProps, 'className'>> = {
  'ping-pong': {
    title: "Asteroids",
    description: "Experimenta la emoción del ping pong clásico con mecánicas modernas y recompensas blockchain.",
    leftIcon: "🏓",
    rightIcon: "⚡",
    infoCards: [
      {
        icon: "🎮",
        title: "Controles",
        description: "Controles táctiles intuitivos para móvil y teclado para desktop"
      },
      {
        icon: "🏆",
        title: "Competencia",
        description: "Enfréntate a la IA o juega contra otros jugadores online"
      }
    ],
    features: ["Multijugador", "IA Avanzada", "Power-ups", "Torneos"],
    stats: [
      { value: "60fps", label: "Fluidez" },
      { value: "∞", label: "Partidas" },
      { value: "★★★☆☆", label: "Dificultad" }
    ]
  },

  'bubble-merge': {
    title: "Bubble Merge",
    description: "Combina burbujas del mismo color para crear explosiones espectaculares y alcanzar puntuaciones increíbles.",
    leftIcon: "🫧",
    rightIcon: "💫",
    infoCards: [
      {
        icon: "🎨",
        title: "Colores",
        description: "Combina burbujas de colores vibrantes en patrones únicos"
      },
      {
        icon: "💥",
        title: "Explosiones",
        description: "Crea reacciones en cadena para máximas puntuaciones"
      }
    ],
    features: ["Física Realista", "Combos", "Efectos Visuales", "Nivel Infinito"],
    stats: [
      { value: "12", label: "Colores" },
      { value: "∞", label: "Niveles" },
      { value: "★★☆☆☆", label: "Dificultad" }
    ]
  },

  'candy-sweet': {
    title: "Candy Sweet",
    description: "Combina dulces deliciosos en este adictivo juego de match-3 con recompensas especiales.",
    leftIcon: "🍭",
    rightIcon: "🌟",
    infoCards: [
      {
        icon: "🍬",
        title: "Match-3",
        description: "Combina 3 o más dulces del mismo tipo para eliminarlos"
      },
      {
        icon: "🎁",
        title: "Power-ups",
        description: "Desbloquea dulces especiales con poderes únicos"
      }
    ],
    features: ["Match-3 Clásico", "Dulces Especiales", "Niveles Temáticos", "Desafíos Diarios"],
    stats: [
      { value: "500+", label: "Niveles" },
      { value: "15", label: "Power-ups" },
      { value: "★★★☆☆", label: "Dificultad" }
    ]
  },

  'sort-puzzle': {
    title: "Sort Puzzle",
    description: "Desafía tu mente con puzzles de ordenamiento donde la lógica y la estrategia son clave para el éxito.",
    leftIcon: "🧩",
    rightIcon: "🔄",
    infoCards: [
      {
        icon: "🧠",
        title: "Lógica",
        description: "Ejercita tu mente con patrones complejos de ordenamiento"
      },
      {
        icon: "⏱️",
        title: "Tiempo",
        description: "Resuelve puzzles antes de que se agote el tiempo"
      }
    ],
    features: ["Puzzles Únicos", "Dificultad Creciente", "Modo Zen", "Logros"],
    stats: [
      { value: "200+", label: "Puzzles" },
      { value: "5", label: "Categorías" },
      { value: "★★★★☆", label: "Dificultad" }
    ]
  },

  'pipes-flood': {
    title: "Pipes & Flood",
    description: "Conecta tuberías estratégicamente para controlar el flujo de agua y evitar inundaciones catastróficas.",
    leftIcon: "🚿",
    rightIcon: "💧",
    infoCards: [
      {
        icon: "🔧",
        title: "Construcción",
        description: "Diseña sistemas de tuberías eficientes y funcionales"
      },
      {
        icon: "🌊",
        title: "Flujo",
        description: "Controla la presión y dirección del agua"
      }
    ],
    features: ["Física de Fluidos", "Construcción Libre", "Desafíos", "Editor de Niveles"],
    stats: [
      { value: "100+", label: "Piezas" },
      { value: "50+", label: "Niveles" },
      { value: "★★★☆☆", label: "Dificultad" }
    ]
  },

  'hover-racer': {
    title: "Hover Racer",
    description: "Acelera en pistas futuristas con vehículos que desafían la gravedad en carreras de alta velocidad.",
    leftIcon: "🏎️",
    rightIcon: "⚡",
    infoCards: [
      {
        icon: "🚀",
        title: "Velocidad",
        description: "Alcanza velocidades supersónicas en pistas imposibles"
      },
      {
        icon: "🛸",
        title: "Anti-gravedad",
        description: "Vehículos que flotan y giran en todas las direcciones"
      }
    ],
    features: ["Carreras Futuristas", "Vehículos Únicos", "Pistas 3D", "Multijugador"],
    stats: [
      { value: "15", label: "Pistas" },
      { value: "8", label: "Vehículos" },
      { value: "★★★★☆", label: "Dificultad" }
    ]
  },

  'infinite-runner': {
    title: "Infinite Runner",
    description: "Corre sin parar en mundos procedurales donde cada partida es una nueva aventura épica.",
    leftIcon: "🏃",
    rightIcon: "♾️",
    infoCards: [
      {
        icon: "🌍",
        title: "Mundos",
        description: "Explora biomas generados proceduralmente"
      },
      {
        icon: "⚡",
        title: "Power-ups",
        description: "Recolecta mejoras que cambian el gameplay"
      }
    ],
    features: ["Generación Procedural", "Múltiples Biomas", "Personajes", "Misiones"],
    stats: [
      { value: "∞", label: "Distancia" },
      { value: "12", label: "Power-ups" },
      { value: "★★☆☆☆", label: "Dificultad" }
    ]
  },

  'cake-mania': {
    title: "Cake Mania",
    description: "Gestiona tu pastelería en este frenético juego de administración del tiempo y creatividad culinaria.",
    leftIcon: "🍰",
    rightIcon: "⏰",
    infoCards: [
      {
        icon: "👩‍🍳",
        title: "Chef",
        description: "Conviértete en el maestro pastelero más famoso"
      },
      {
        icon: "💰",
        title: "Negocio",
        description: "Administra tu tiempo y recursos eficientemente"
      }
    ],
    features: ["Gestión de Tiempo", "Recetas Únicas", "Mejoras", "Clientes Especiales"],
    stats: [
      { value: "50+", label: "Recetas" },
      { value: "100+", label: "Niveles" },
      { value: "★★★☆☆", label: "Dificultad" }
    ]
  },

  'game10': {
    title: "Mystery Game",
    description: "Un juego misterioso lleno de sorpresas que desafía tus expectativas y habilidades.",
    leftIcon: "❓",
    rightIcon: "🎮",
    infoCards: [
      {
        icon: "🔍",
        title: "Exploración",
        description: "Descubre mecánicas únicas mientras juegas"
      },
      {
        icon: "🎯",
        title: "Desafíos",
        description: "Cada nivel presenta nuevos retos inesperados"
      }
    ],
    features: ["Mecánicas Únicas", "Sorpresas", "Adaptativo", "Innovador"],
    stats: [
      { value: "???", label: "Niveles" },
      { value: "∞", label: "Posibilidades" },
      { value: "★★★★★", label: "Misterio" }
    ]
  },

  'EmbeddedWars': {
    title: "Ultimate Challenge",
    description: "El desafío definitivo que combina lo mejor de todos los géneros en una experiencia única.",
    leftIcon: "🏆",
    rightIcon: "🌟",
    infoCards: [
      {
        icon: "⚔️",
        title: "Combate",
        description: "Sistema de combate dinámico y estratégico"
      },
      {
        icon: "🧩",
        title: "Puzzles",
        description: "Resuelve enigmas complejos para avanzar"
      }
    ],
    features: ["Multi-Género", "Boss Battles", "Narrativa Rica", "Personalización"],
    stats: [
      { value: "∞", label: "Aventuras" },
      { value: "100+", label: "Habilidades" },
      { value: "★★★★★", label: "Épico" }
    ]
  }
};

export default gameContentConfigs;
