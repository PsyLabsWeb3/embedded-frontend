import React from 'react';
import './MatchConfirmationModal.css';
import gameboyIcon from '../../assets/gameboy.svg';

interface MatchConfirmationModalProps {
  isOpen: boolean;
  amountSol: number;
  amountUsd?: number;
  onReturn: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

const MatchConfirmationModal: React.FC<MatchConfirmationModalProps> = ({
  isOpen,
  amountSol,
  amountUsd,
  onReturn,
  onConfirm,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  // Calcular precio en USD si no se proporciona (usando un precio base de ~$154.79/SOL)
  const usdPrice = amountUsd || (amountSol * 154.79);

  return (
    <div className="match-confirmation-backdrop">
      <div className="match-confirmation-modal">
        {/* Icono del gameboy */}
        <div className="modal-icon">
          <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
        </div>

        {/* Título */}
        <h1 className="modal-title">Match Confirmation</h1>

        {/* Texto principal */}
        <p className="modal-main-text">
          You are about to confirm a match, you will be charged with{' '}
          <span className="sol-amount">{amountSol.toFixed(8)} SOL</span>.
        </p>

        {/* Texto secundario */}
        <p className="modal-secondary-text">
          This will push you up in the 500x Leaderboard.
        </p>

        {/* Texto adicional */}
        <p className="modal-additional-text">
          Please confirm your wallet transaction after.
        </p>

        {/* Botones */}
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

        {/* Badge de precio en la esquina */}
        <div className="price-badge">
          ${usdPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default MatchConfirmationModal;