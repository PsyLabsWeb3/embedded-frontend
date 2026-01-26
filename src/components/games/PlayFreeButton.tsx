import React, { useState } from "react";
import "./PayEntryModal.css";

interface PlayFreeButtonProps {
  onPlay: () => void;
  gameLoading?: boolean;
  gameLoaded?: boolean;
}

const PlayFreeButton: React.FC<PlayFreeButtonProps> = ({
  onPlay,
  gameLoading = false,
  gameLoaded = false,
}) => {
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  const handlePlay = () => {
    setIsLoadingGame(true);
    onPlay();
  };

  return (
    <div className="pay-entry-section">
      <div className="button-group">
        <button
          className="pay-entry-button casual-play-button play-free-button"
          onClick={handlePlay}
          disabled={gameLoading || isLoadingGame}
          aria-busy={isLoadingGame}
          style={{ width: "100%" }}
        >
          {isLoadingGame ? "LOADING..." : "PLAY FREE"}
        </button>
      </div>
    </div>
  );
};

export default PlayFreeButton;
