import React, { useEffect } from 'react';
import './MatchConfirmationModal.css';
import gameboyIcon from '../../assets/gameboy.svg';

interface MatchConfirmationModalProps {
  isOpen: boolean;
  amountSol: number;
  onReturn: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  isLoadingTransaction?: boolean;
  transactionId?: string;
}

const MatchConfirmationModal: React.FC<MatchConfirmationModalProps> = ({
  isOpen,
  amountSol,
  onReturn,
  onConfirm,
  isProcessing = false,
  isLoadingTransaction = false,
  transactionId
}) => {
  if (!isOpen) return null;

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Prevent modal close when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="match-confirmation-backdrop" onClick={handleBackdropClick}>
      <div className="match-confirmation-modal" onClick={handleModalClick}>
        
        {isLoadingTransaction ? (
          // State 2: Match Confirmed - Processing transaction
          <>
            {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">Match<br />Confirmed</h1>
              </div>
              <div className="modal-icon-section">
                <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
              </div>
            </div>

            {/* Main waiting text */}
            <p className="modal-main-text">
              Please wait while we search a match for your game.
            </p>

            {/* Secondary text */}
            <p className="modal-secondary-text">
              Please confirm your wallet transaction if you haven't
            </p>

            {/* Transaction ID */}
            {transactionId && (
              <div className="transaction-section">
                <p className="transaction-label">Tx ID:</p>
                <p className="transaction-id">
                  {transactionId}
                </p>
              </div>
            )}

            {/* Logo and Loading */}
            <div className="loading-section">
              <div className="embedded-logo-container">
                <img src="/logo.svg" alt="Embedded Logo" className="embedded-logo" />
              </div>
              <div className="loading-text">
                <span className="loading-spinner"></span>
                <p className="loading-label">Loading</p>
              </div>
            </div>
          </>
        ) : (
          // State 1: Initial confirmation
          <>
            {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">Match<br />Confirmation</h1>
              </div>
              <div className="modal-icon-section">
                <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
              </div>
            </div>

            {/* Main text */}
            <p className="modal-main-text">
              You are about to confirm a match, you will be charged with{' '}
              <span className="sol-amount">{amountSol.toFixed(8)} SOL</span>.
            </p>

            {/* Secondary text */}
            <p className="modal-secondary-text">
              This will push you up in the 500x Leaderboard.
            </p>

            {/* Additional text */}
            <p className="modal-additional-text">
              Please confirm your wallet transaction after.
            </p>

            {/* Action Buttons */}
            <div className="modal-buttons">
              <button
                className="modal-button return-button"
                onClick={onReturn}
                disabled={isProcessing}
              >
                RETURN
              </button>
              <button
                className="modal-button confirm-button"
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : 'CONFIRM MATCH'}
              </button>
            </div>
          </>
        )}

        {/* Price badge in corner - TEMPORARILY COMMENTED OUT */}
        {/* 
        <div className="price-badge">
          ${usdPrice.toFixed(2)}
        </div>
        */}
      </div>
    </div>
  );
};

export default MatchConfirmationModal;