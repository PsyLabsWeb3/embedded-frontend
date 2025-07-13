import './ComingSoonCard.css';

interface ComingSoonCardProps {
  title: string;
  description: string;
  className?: string;
}

const ComingSoonCard = ({ title, description, className = '' }: ComingSoonCardProps) => (
  <div className={`coming-soon-card ${className}`}>
    <div className="coming-soon-badge">Coming Soon</div>
    <h3 className="coming-soon-title">{title}</h3>
    <p className="coming-soon-description">{description}</p>
  </div>
);

export default ComingSoonCard;
