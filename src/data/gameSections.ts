type GameNavItem = {
  id: string;
  title: string;
  path: string;
  mode: 'pve' | 'pvp';
};

export const pveGames: GameNavItem[] = [
  {
    id: '12-smugglers-run',
    title: 'Smugglers Run',
    path: '/game/12-smugglers-run',
    mode: 'pve',
  },
  {
    id: '01-embedded-snake',
    title: 'Snake',
    path: '/game/01-embedded-snake',
    mode: 'pve',
  }
];

export const pvpGames: GameNavItem[] = [
  {
    id: '03-embedded-wars',
    title: 'Embedded Wars',
    path: '/game/03-embedded-wars',
    mode: 'pvp',
  },
  {
    id: '02-asteroids',
    title: 'Asteroids',
    path: '/game/02-asteroids',
    mode: 'pvp',
  }
];


export const freeGames: GameNavItem[] = [
  {
    id: '03-embedded-wars',
    title: 'Embedded Wars',
    path: '/game/03-embedded-wars',
    mode: 'pvp',
  },
  {
    id: '02-asteroids',
    title: 'Asteroids',
    path: '/game/02-asteroids',
    mode: 'pvp',
  }
];
