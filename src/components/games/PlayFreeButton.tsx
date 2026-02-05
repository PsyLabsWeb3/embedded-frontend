import React, { useState } from "react";
import "./PayEntryModal.css";

interface PlayFreeButtonProps {
  onPlay: () => void;
  onAdEnd?: () => void;
  gameLoading?: boolean;
  gameLoaded?: boolean;
}

const PlayFreeButton: React.FC<PlayFreeButtonProps> = ({
  onPlay,
  gameLoading = false,
  // gameLoaded = false,
}) => {
  // Only manage button state here, not ad overlay
  const [adWatched] = useState(false);

  const handlePlay = () => {
    onPlay(); // Start loading the Unity game immediately and show ad overlay from parent
  };

  // Prevent button from being clickable after ad is watched and game is loading
  const isButtonDisabled = gameLoading || adWatched;

  return (
    <div className="pay-entry-section">
      <div className="button-group">
        <button
          className="pay-entry-button casual-play-button"
          onClick={handlePlay}
          disabled={isButtonDisabled}
          aria-busy={false}
          style={{ width: "100%" }}
        >
          PLAY FREE
        </button>
      </div>
    </div>
  );
};

export default PlayFreeButton;
