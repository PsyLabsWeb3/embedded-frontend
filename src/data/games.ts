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
    image: '/src/assets/snake_game.jpg',
    glowClass: 'neon-green',
  },
  {
    title: 'Ping Pong',
    slug: 'pingpong',
    image: '/src/assets/pingpong.jpg',
    glowClass: 'neon-blue',
  },
  {
    title: 'Bubble Merge',
    slug: 'bubblemerge',
    image: '/src/assets/bubble.jpg',
    glowClass: 'neon-purple',
  },
];

export default games;
