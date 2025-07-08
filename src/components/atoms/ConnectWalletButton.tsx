import '../../styles/sections/ConnectWalletButton.css';

// Responsive Connect Wallet Button component
const ConnectWalletButton = () => {
  const handleConnect = () => {
    alert('Simulación: Wallet conectada');
  };
  
  return (
    <button
      className="connect-wallet-btn btn"
      onClick={handleConnect}
    >
      <span className="connect-wallet-text">Conectar Wallet</span>
    </button>
  );
};


export default ConnectWalletButton;
