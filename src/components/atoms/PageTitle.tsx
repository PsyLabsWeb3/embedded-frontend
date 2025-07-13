import './PageTitle.css';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

const PageTitle = ({ children, className = '' }: PageTitleProps) => (
  <h1 className={`page-title ${className}`}>
    {children}
  </h1>
);

export default PageTitle;
