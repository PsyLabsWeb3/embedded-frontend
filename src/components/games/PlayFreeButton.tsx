import React, { useState, useRef } from "react";
import "./PayEntryModal.css";
import AddReelMotionAIVideo from "../../assets/Adds/AddReelMotionAI.mp4";

interface PlayFreeButtonProps {
  onPlay: () => void;
  gameLoading?: boolean;
  gameLoaded?: boolean;
}

const PlayFreeButton: React.FC<PlayFreeButtonProps> = ({
  onPlay,
  gameLoading = false,
  // gameLoaded = false,
}) => {
  const [showAd, setShowAd] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setShowAd(true);
  };

  const handleAdEnded = () => {
    setShowAd(false);
    setAdWatched(true);
    onPlay();
  };

  // Prevent button from being clickable after ad is watched and game is loading
  const isButtonDisabled = gameLoading || showAd || adWatched;

  return (
    <div className="pay-entry-section">
      <div className="button-group">
        <button
          className="pay-entry-button casual-play-button"
          onClick={handlePlay}
          disabled={isButtonDisabled}
          aria-busy={showAd}
          style={{ width: "100%" }}
        >
          {showAd ? "LOADING..." : "PLAY FREE"}
        </button>
      </div>
      {showAd && (
        <div
          className="pay-entry-ad-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            ref={videoRef}
            src={AddReelMotionAIVideo}
            autoPlay
            playsInline
            onEnded={handleAdEnded}
            style={{
              maxWidth: "90vw",
              maxHeight: "60vh",
              borderRadius: "16px",
              boxShadow: "0 2px 24px #000a",
              background: "#000",
            }}
            controls={false}
          />
          {/* If browser blocks autoplay with audio, show a play button */}
          {videoRef.current && videoRef.current.paused && (
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "1.5rem",
                padding: "1rem 2rem",
                borderRadius: "8px",
                background: "#5dd62c",
                color: "#1a1d1f",
                border: "none",
                cursor: "pointer",
                zIndex: 10000,
              }}
              onClick={() => videoRef.current && videoRef.current.play()}
            >
              ▶ Play Ad
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayFreeButton;
