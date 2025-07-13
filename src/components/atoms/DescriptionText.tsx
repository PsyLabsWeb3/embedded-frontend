import './DescriptionText.css';

interface DescriptionTextProps {
  children: React.ReactNode;
  className?: string;
}

const DescriptionText = ({ children, className = '' }: DescriptionTextProps) => (
  <p className={`description-text ${className}`}>
    {children}
  </p>
);

export default DescriptionText;
