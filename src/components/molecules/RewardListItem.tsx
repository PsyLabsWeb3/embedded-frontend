import RewardBullet from '../atoms/RewardBullet';

type RewardListItemProps = {
  children: React.ReactNode;
  cardClass?: string;
};

const RewardListItem = ({ children, cardClass }: RewardListItemProps) => (
  <li className="reward-list-item-wrapper">
    <div className={`reward-card-desktop ${cardClass ?? ''}`.trim()}>
      <div className="reward-list-item">
        <RewardBullet />
        <span>{children}</span>
      </div>
    </div>
  </li>
);

export default RewardListItem;
