import React, { useEffect, useRef, useState } from "react";
import "../../styles/cursorGlow.css";

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isOnInteractive, setIsOnInteractive] = useState(false);
  const [isNearImage, setIsNearImage] = useState(false);
  const [isOnVideo, setIsOnVideo] = useState(false);
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

      // Check if directly over a video element
      const isOverVideo =
        target.tagName === "VIDEO" || !!target.closest("video");
      setIsOnVideo(isOverVideo);

      // Check proximity to images, videos, and game cards
      const images = document.querySelectorAll("img");
      const videos = document.querySelectorAll("video");
      const gameCards = document.querySelectorAll(".game-card");
      let nearImage = false;
      const proximityThreshold = 150; // pixels

      // Check proximity to regular images
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - imgCenterX, 2) +
            Math.pow(e.clientY - imgCenterY, 2)
        );

        if (distance < proximityThreshold) {
          nearImage = true;
        }
      });

      // Check proximity to videos
      videos.forEach((video) => {
        const rect = video.getBoundingClientRect();
        const videoCenterX = rect.left + rect.width / 2;
        const videoCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - videoCenterX, 2) +
            Math.pow(e.clientY - videoCenterY, 2)
        );

        if (distance < proximityThreshold) {
          nearImage = true;
        }
      });

      // Check proximity to game cards
      gameCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - cardCenterX, 2) +
            Math.pow(e.clientY - cardCenterY, 2)
        );

        if (distance < proximityThreshold) {
          nearImage = true;
        }
      });

      setIsNearImage(nearImage);

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
        } ${isNearImage ? "near-image" : ""} ${isOnVideo ? "on-video" : ""}`}
      />
    </div>
  );
};

export default CursorGlow;
