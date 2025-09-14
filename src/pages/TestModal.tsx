import React, { useState } from 'react';
import MatchConfirmationModal from '../components/modals/MatchConfirmationModal';

const TestModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReturn = () => {
    setIsOpen(false);
    console.log('Modal closed - Return clicked');
  };

  const handleConfirm = () => {
    setIsOpen(false);
    console.log('Match confirmed!');
  };

  return (
    <div style={{ padding: '2rem', background: '#171D20', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', fontFamily: 'Lobster' }}>Test Modal</h1>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          background: '#AE43FF',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Alumni Sans',
          textTransform: 'uppercase'
        }}
      >
        Test Modal
      </button>
      
      <MatchConfirmationModal
        isOpen={isOpen}
        amountSol={0.003226}
        amountUsd={0.50}
        onReturn={handleReturn}
        onConfirm={handleConfirm}
        isProcessing={false}
      />
    </div>
  );
};

export default TestModal;