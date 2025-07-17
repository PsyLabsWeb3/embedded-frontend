
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
import { useWallet } from "@solana/wallet-adapter-react";

import loaderUrl from '../../assets/Unity/PingPong//Build/EM-17-PingPong.loader.js?url';
import dataUrl from '../../assets/Unity/PingPong/Build/EM-17-PingPong.data?url';
import frameworkUrl from '../../assets/Unity/PingPong/Build/EM-17-PingPong.framework.js?url';
import codeUrl from '../../assets/Unity/PingPong/Build/EM-17-PingPong.wasm?url';


const PingPongGame = ()=> {
  const { publicKey, connected } = useWallet();
  
  const unityContext = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });


    if (connected && publicKey !== null) {
      unityContext.sendMessage("WalletManager", "SetWalletAddress", publicKey.toString());
      console.log("Enviado a Unity:", publicKey.toString());
    } else {
      console.log("No se detecto wallet conectada");
    }

    return <Unity className={styles.container} unityProvider={unityContext.unityProvider} />;

};


export default PingPongGame;

