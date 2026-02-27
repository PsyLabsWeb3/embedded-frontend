// Tournament data for display and modal info
export interface Tournament {
  title: string;
  subtitle?: string; // Optional subtitle for modal
  image: string;
  status: string;
  statusColor: string;
  description: string;
  reward: string;
  date: string;
  time: string;
  game: string;
  details?: string; // Optional rich details for modal (HTML or JSX string)
  actionButton?: {
    label: string;
    href: string;
  };
}

import gmTournamentImage from "../assets/GM3Bottles.jpg";
import ewTournamentImage from "../assets/EmbeddedWarsCoverNEON.png";

const TOURNAMENTS: Tournament[] = [
  {
    title: "Guerrero Maya PvE Tournament",
    image: gmTournamentImage,
    status: "COMING SOON",
    statusColor: "#ae43ff",
    description:
      "Classic arcade space shooter where players pilot a spaceship, destroying drifting asteroids and enemy threats while avoiding collisions in the depths of space.",
    reward: "Rewards 100 USD",
    date: "2026-02-10",
    time: "18:00 UTC",
    game: "Guerrero Maya",
    details: `
        <div style="font-size:1.13em;line-height:1.7;">
          <p><b>The Guerrero Maya PvE Tournament</b> is a special competitive event created in collaboration with Embedded Games and proudly sponsored by Solmare.</p>
          <p>This is a pure PvE grind tournament where skill expression comes from consistency and dedication.<br>
          <b>No brackets, no eliminations, no matchmaking advantage</b>—the only thing that matters is the total number of matches played during the tournament week. Every game counts.</p>
          <p>Throughout the week, players compete to climb the leaderboard by simply playing Guerrero Maya PvE as much as possible. At the end of the tournament, winners will be rewarded with a <b>SOL prize pool</b>, distributed as is customary within the Solana ecosystem.</p>
          <hr style="border:0;border-top:1.5px solid #333;margin:18px 0;">
          <div style="margin-bottom:10px;">
            <b style='color:#5dd62c;font-size:1.15em'>🏆 Grand Prize – 1st Place</b><br>
            <span>The top-ranked player will win an all-inclusive luxury stay in the Mayan jungle at Solmare accommodation in Akumal, where they will live the Guerrero Maya experience in real life:</span>
            <ul style='margin-left:1.2em;color:#bdbdbd;margin-top:8px;'>
              <li>Authentic Mayan gastronomy</li>
              <li>Premium cocktail experiences featuring Guerrero Maya mezcal</li>
              <li>Curated rituals and luxury jungle experiences</li>
              <li>Full immersion into the culture, mythology, and spirit of Guerrero Maya</li>
            </ul>
          </div>
          <div style="margin-bottom:10px;">
            <b style='color:#5dd62c;font-size:1.1em'>🥈🥉 2nd & 3rd Place Rewards</b><br>
            <span>2nd Place: Guerrero Maya mezcal bottle<br>3rd Place: Guerrero Maya mezcal bottle</span>
          </div>
          <hr style="border:0;border-top:1.5px solid #333;margin:18px 0;">
          <p>This tournament is designed to reward commitment, passion, and community participation—whether you’re a hardcore grinder or a dedicated daily player, every match pushes you closer to victory.</p>
          <p style="font-size:1.08em;"><b>Play more. Rank higher.</b><br>
          From the digital battlefield to the Mayan jungle—Guerrero Maya transcends the game. 🌿🔥</p>
        </div>
      `,
  },
  {
    title: "Embedded Wars Tournament",
    subtitle: "The Ultimate PvP Showdown",
    image: ewTournamentImage,
    status: "ENDED",
    statusColor: "#d62c2c",
    description:
      "Classic arcade space shooter where players pilot a spaceship, destroying drifting asteroids and enemy threats while avoiding collisions in the depths of space.",
    reward: "Rewards 50 USD",
    date: "2026-02-21",
    time: "17:00 UTC",
    game: "Embedded Wars",
    details: "For all the instructions, join our discord here:",
    actionButton: {
      label: "Join Discord",
      href: "https://discord.gg/y9TkSUXF6G",
    },
  },
];

export default TOURNAMENTS;
