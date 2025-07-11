
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
import { useWallet } from "@solana/wallet-adapter-react";

import loaderUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-14-WalletManager.loader.js?url';
import dataUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-14-WalletManager.data?url';
import frameworkUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-14-WalletManager.framework.js?url';
import codeUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-14-WalletManager.wasm?url';
const EmbeddedGame = ()=> {
  const { publicKey, connected } = useWallet();
  
  const unityContext = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

//Normalmente se usa el siguiente codigo para cargar el juego desde public
    // const { unityProvider } = useUnityContext({
    //   loaderUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.loader.js",
    //   dataUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.data",
    //   frameworkUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.framework.js",
    //   codeUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.wasm",
    // });

    const sendMessageToUnity = unityContext.sendMessage;


    if (connected && publicKey !== null) {
      unityContext.sendMessage("WalletManager", "SetWalletAddress", publicKey.toString());
      console.log("Enviado a Unity:", publicKey.toString());
    } else {
      console.log("No se detecto wallet conectada");
    }

    return <Unity className={styles.container} unityProvider={unityContext.unityProvider} />;

};


export default EmbeddedGame;

