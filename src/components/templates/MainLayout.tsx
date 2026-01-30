import type { ReactNode } from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  gradientBackground?: boolean;
}

const MainLayout = ({ children, className = "", gradientBackground = false }: MainLayoutProps) => (
  <div
    className={`main-layout ${className}`}
    style={{
      minHeight: "100vh",
      ...(gradientBackground
        ? { background: "linear-gradient(to bottom, #101010, #0f2118)" }
        : {})
    }}
  >
      <>
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </>
  </div>
);

export default MainLayout;
