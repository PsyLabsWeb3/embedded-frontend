import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';


// Componente responsivo para conectar la wallet
const ConnectWalletButton = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <>
      {connected ? (
        <button onClick={disconnect} className="btn bg-red-500">
          Disconnect ({publicKey ? publicKey.toString().slice(0, 4) : '----'}...)
        </button>
      ) : (
        <button onClick={() => setVisible(true)} className="btn bg-blue-500">
         <img src={walletIcon} alt="wallet" className="w-6 h-6" />
        </button>
      )}
    </>
  );
  
};


export default ConnectWalletButton;
