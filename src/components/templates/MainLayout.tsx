import type { ReactNode } from 'react';
import Navbar from '../sections/Navbar';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className = '' }: MainLayoutProps) => (
  <div className={`main-layout ${className}`}>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

export default MainLayout;
