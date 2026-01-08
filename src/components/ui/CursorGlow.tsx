import React, { useEffect, useRef, useState } from "react";
import "../../styles/cursorGlow.css";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  opacity: number;
}

interface Trail {
  x: number;
  y: number;
  opacity: number;
}

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isOnInteractive, setIsOnInteractive] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const particleIdRef = useRef(0);
  const lastParticleTime = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let isMoving = false;
    let timeoutId: NodeJS.Timeout;

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const size = Math.random() * 4 + 2;

      return {
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size,
        opacity: Math.random() * 0.5 + 0.5,
      };
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02,
          opacity: particle.opacity * 0.96,
        }))
        .filter((particle) => particle.life > 0);
    };

    const updateTrails = () => {
      // Add new trail point
      if (positionRef.current.x !== lastPositionRef.current.x || 
          positionRef.current.y !== lastPositionRef.current.y) {
        trailsRef.current.push({
          x: positionRef.current.x,
          y: positionRef.current.y,
          opacity: 0.8,
        });
      }

      // Update existing trails
      trailsRef.current = trailsRef.current
        .map((trail) => ({
          ...trail,
          opacity: trail.opacity * 0.9,
        }))
        .filter((trail) => trail.opacity > 0.05);

      // Keep only last 15 trail points
      if (trailsRef.current.length > 15) {
        trailsRef.current = trailsRef.current.slice(-15);
      }

      lastPositionRef.current = { ...positionRef.current };
    };

    const renderParticles = () => {
      if (!containerRef.current) return;

      // Clear old particles
      const oldParticles = containerRef.current.querySelectorAll('.particle');
      oldParticles.forEach((p) => p.remove());

      // Render new particles
      particlesRef.current.forEach((particle) => {
        const el = document.createElement('div');
        el.className = 'particle';
        el.style.left = `${particle.x}px`;
        el.style.top = `${particle.y}px`;
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size}px`;
        el.style.opacity = `${particle.opacity}`;
        containerRef.current?.appendChild(el);
      });
    };

    const renderTrails = () => {
      if (!containerRef.current) return;

      // Clear old trails
      const oldTrails = containerRef.current.querySelectorAll('.trail');
      oldTrails.forEach((t) => t.remove());

      // Render new trails
      trailsRef.current.forEach((trail, index) => {
        const el = document.createElement('div');
        el.className = 'trail';
        el.style.left = `${trail.x}px`;
        el.style.top = `${trail.y}px`;
        el.style.opacity = `${trail.opacity * (index / trailsRef.current.length)}`;
        containerRef.current?.appendChild(el);
      });
    };

    const animate = () => {
      updateParticles();
      updateTrails();
      renderParticles();
      renderTrails();

      if (glowRef.current) {
        glowRef.current.style.left = `${positionRef.current.x}px`;
        glowRef.current.style.top = `${positionRef.current.y}px`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (!isMoving) {
        setIsActive(true);
        isMoving = true;
      }

      // Create particles at intervals
      if (now - lastParticleTime.current > 50) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(createParticle(e.clientX, e.clientY));
        }
        lastParticleTime.current = now;
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

    animationFrameRef.current = requestAnimationFrame(animate);

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
    <div className="cursor-glow-container" ref={containerRef}>
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
