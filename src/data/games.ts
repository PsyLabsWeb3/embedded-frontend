import snakeGameImage from '../assets/snake_game.jpg';
import pingpongImage from '../assets/pingpong.jpg';
import bubbleImage from '../assets/bubble.jpg';

export type Game = {
  title: string;
  image: string;
  slug: string;
  glowClass: string;
};

const games: Game[] = [
  {
    title: 'Snake',
    slug: 'snake',
    image: snakeGameImage,
    glowClass: 'neon-green',
  },
  {
    title: 'Ping Pong',
    slug: 'pingpong',
    image: pingpongImage,
    glowClass: 'neon-blue',
  },
  {
    title: 'Bubble Merge',
    slug: 'bubblemerge',
    image: bubbleImage,
    glowClass: 'neon-purple',
  },
];

export default games;
