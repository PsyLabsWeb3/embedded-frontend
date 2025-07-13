import './PrimaryButton.css';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button'
}: PrimaryButtonProps) => (
  <button 
    type={type}
    className={`primary-button ${disabled ? 'disabled' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default PrimaryButton;
