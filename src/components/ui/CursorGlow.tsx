import React, { useEffect, useRef, useState } from "react";
import "../../styles/cursorGlow.css";

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isOnInteractive, setIsOnInteractive] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let isMoving = false;
    let timeoutId: NodeJS.Timeout;

    const updateGlowPosition = () => {
      if (glowRef.current) {
        glowRef.current.style.left = `${positionRef.current.x}px`;
        glowRef.current.style.top = `${positionRef.current.y}px`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (!isMoving) {
        setIsActive(true);
        isMoving = true;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'button, a, [role="button"], input, select, textarea'
      );
      setIsOnInteractive(!!isInteractive);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isMoving = false;
      }, 100);

      // Use RAF for smooth animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateGlowPosition);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="cursor-glow-container">
      <div
        ref={glowRef}
        className={`cursor-glow ${isActive ? "active" : ""} ${
          isOnInteractive ? "on-interactive" : ""
        }`}
      />
    </div>
  );
};

export default CursorGlow;
