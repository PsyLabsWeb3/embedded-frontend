import './PageHeader.css';
import PageTitle from '../atoms/PageTitle';
import DescriptionText from '../atoms/DescriptionText';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader = ({ title, description, className = '' }: PageHeaderProps) => (
  <header className={`page-header ${className}`}>
    <PageTitle>{title}</PageTitle>
    {description && <DescriptionText>{description}</DescriptionText>}
  </header>
);

export default PageHeader;
