import RewardBullet from '../atoms/RewardBullet';

const RewardListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="reward-list-item">
    <RewardBullet />
    <span>{children}</span>
  </li>
);

export default RewardListItem;
